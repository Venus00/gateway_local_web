import { ForbiddenException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Action, ConnectionCreateDto } from './connection.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema'
import { connectionInputs, connectionOutputs, machine } from '../../db/schema';
import { eq, inArray } from 'drizzle-orm';
import { TenancyService } from 'src/tenancy/tenancy.service';
@Injectable()
export class ConnectionService implements OnModuleInit {
  private logger = new Logger(ConnectionService.name);
  constructor(
    private tenant:TenancyService,
    @Inject('DB_DEV') private readonly db:NodePgDatabase<typeof schema>,
    ) {}
  async onModuleInit() {}

  async action(data:Action,tenantSlug:string) {
    try {
     
      const deviceOutput = await this.db.query.device_output.findFirst({
        where:(device_output , {eq})=>eq(device_output.id,data.deviceOutputId),
      });
      if (!deviceOutput) {
        throw new Error('Device Output not found');
      }
      const device = await this.db.query.device.findFirst({
        where:(device , {eq})=>eq(device.id,deviceOutput.deviceId),
      });
      if (!device) {
        throw new Error('Device not found');
      }
      
      //check device if gerophare 
      let message = ""
      if(deviceOutput.name === 'R')
      {
        message = 'R250G0B0F20A2E'
      }
      else if (deviceOutput.name === 'G')
      {
        message = 'R0G250B0F20A2E'
      }
      else if (deviceOutput.name === 'B')
      {
        message = 'R0G0B250F20A2E'
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  }
  async deleteConnection(id: number,tenantSlug:string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug); 

    try {
      const connectionItem = await tenantDb.query.machine.findFirst({
        where:eq(machine.id,id)
      })
      if(connectionItem)
      {
        await tenantDb.delete(connectionInputs).where(eq(connectionInputs.machineId,connectionItem?.machineId))
        await tenantDb.delete(connectionOutputs).where(eq(connectionOutputs.machineId,connectionItem?.machineId))
      }
      // await tenantDb.delete(connection).where(eq(connection.machineId,id));
      return 'Success';
    } catch (error) {
      console.log(error);
      return 'Error';
    }
  }
  // async insertConnection(data: ConnectionCreateDto,tenantSlug:string) {
  //   const tenantDb = await this.tenant.getTenantConnection(tenantSlug); 

  //   try {
  //     const [connectionItem]  = await tenantDb.insert(connection).values({
  //       tenantId:data.tenantId,
  //       name: data.name,
  //       machineId: data.machineId,
  //       machineInput:data.machineInput,
  //       machineOutput:data.machineOutput,

  //     }).returning({connectionId:connection.machineId}).execute();

  //     await tenantDb.insert(schema.connectionInputs).values(
  //       data.deviceInput.map((item)=>{
  //         return {
  //           inputId:item.id,
  //           connectionId:connectionItem.connectionId,
  //         }
  //       })
  //     )
      
  //     await tenantDb.insert(schema.connectionOutputs).values(
  //       data.deviceOutput.map((item)=>{
  //         return {
  //           outputId:item.id,
  //           connectionId:connectionItem.connectionId,
  //         }
  //       })
  //     )
  //     return 'Success';
  //   } catch (error) {
  //     console.log(error);
  //     return 'success';
  //   }
  // }

  // async findConnection(tenantId:number,tenantSlug:string) {
  //   const tenantDb = await this.tenant.getTenantConnection(tenantSlug); 

  //   try {
  //     return await tenantDb.query.connection.findMany(
  //       {
  //         where:eq(connection.tenantId,tenantId),
  //         with:{
            
  //           deviceInput:{
  //             with:{
  //               input:true,
  //             }
  //           },
  //           deviceOutput:{
  //             with:{
  //               output:true,
  //             }
  //           },
  //           machine:true,
  //         }
  //       }
  //     );
  //   } catch (error) {
  //     console.error('Error fetching machines:', error);
  //     throw new ForbiddenException('Access denied: No permissions found');
  //   }
  // }
}
