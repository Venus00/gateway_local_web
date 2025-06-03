/* eslint-disable prettier/prettier */
import { ForbiddenException, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MachineCreateDto, MachineLayoutDto, MachineTypeInsertDto, MachineTypeUpdateDto, MachineUpdateDto } from './machine.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { machine, machine_type } from '../../db/schema';
import { TenancyService } from 'src/tenancy/tenancy.service';
@Injectable()
export class MachineService implements OnModuleInit {
  private logger = new Logger(MachineService.name);
  constructor(
    private tenant: TenancyService,
    @Inject('DB_DEV') private readonly db: NodePgDatabase<typeof schema>) { }
  async onModuleInit() { }

  async deleteMachine(id: number, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      await tenantDb.delete(schema.connectionInputs).where(eq(schema.connectionInputs.machineId, id));
      await tenantDb.delete(schema.connectionOutputs).where(eq(schema.connectionOutputs.machineId, id));
      await tenantDb.delete(machine).where(eq(machine.id, id));

      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
  async insertMachineType(data: MachineTypeInsertDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    await tenantDb.insert(schema.machine_type).values(data).execute();
    // await this.prisma.machineType.create({
    //   data,
    // });
  }

  async findMachineType(tenantId: number, tenantSlug: string) {
    try {
      const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

      return await tenantDb.query.machine_type.findMany({
        where: eq(machine_type.tenantId, tenantId)
      });
    } catch (error) {
      throw new ForbiddenException('Access denied: No permissions found');
    }
  }

  async deleteMachineType(name: string, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    try {
      await tenantDb.delete(machine_type).where(eq(machine_type.name, name));
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
  async insertMachine(data: MachineCreateDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      const [entity] = await tenantDb.insert(machine).values(data).returning({ id: machine.id });;


      await tenantDb.insert(schema.connectionInputs).values(
        data.inputs.map((item) => {
          return {
            inputId: item.inputId,
            machineId: entity.id,
          }
        })
      )

      await tenantDb.insert(schema.connectionOutputs).values(
        data.outputs.map((item) => {
          return {
            outputId: item.outputId,
            machineId: entity.id,
          }
        })
      )
      return 'Success';
    } catch (error) {
      console.log(error);
      return 'success';
    }
  }

  async insertLayout(id: number, data: MachineLayoutDto, type: string, tenantSlug: string) {

    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    console.log('tenantSlug:ssss');
    console.log('create layddddout:', data.layout);
    try {
      if (type === "entity")
        await tenantDb.update(machine).set({
          layout: JSON.stringify(data.layout),
          widget: JSON.stringify(data.widget),
        }).where(eq(machine.id, id)).execute();
      else await tenantDb.update(schema.analytics).set({
        layout: JSON.stringify(data.layout),
        widget: JSON.stringify(data.widget),
      }).where(eq(schema.analytics.id, id)).execute();
      // await this.prisma.machine.update({
      //   where: {
      //     id,
      //   },
      //   data: {
      //     layout: JSON.stringify(data.layout),
      //     widget: JSON.stringify(data.widget),
      //   },
      // });
      return 'Success';
    } catch (error) {
      console.log(error)
      return 'Error';
    }
  }

  async findMachineById(id: number, tenantId: number, tenantSlug: string) {
    try {
      const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
      const machine = await tenantDb.query.machine.findFirst({
        where: (machine, { eq, and }) =>
          and(
            eq(machine.id, id),
            eq(machine.tenantId, tenantId)
          ),
        with: {
          connectionOutputs: {
            with: {
              output: true
            }
          },
          connectionInputs: {
            with: {
              input: true
            }
          }
        },
      })
      if (!machine) return null;

      const transformed = {
        ...machine,
        connection: {
          deviceInput: machine.connectionInputs?.map(ci => ci.input) || [],
          deviceOutput: machine.connectionOutputs?.map(co => co.output) || [],
          machine: {
            id: machine.id,
            name: machine.name,
          }
        }
      };

      return transformed;
    } catch (error) {
      console.log("machine not found")
      throw new ForbiddenException('Access denied: Machine Not Found');
    }

  }
  async findMachineBySerial(serial: string, tenantSlug: string) {

    try {
      const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
      const machine = await tenantDb.query.machine.findFirst({
        where: ((machine, { eq }) => eq(machine.serial, serial)),
        with: {
          connectionOutputs: {
            with: {
              output: true
            }
          },
          connectionInputs: {
            with: {
              input: true
            }
          }
        },
      })
      if (!machine) return null;

      const transformed = {
        ...machine,
        connection: {
          deviceInput: machine.connectionInputs?.map(ci => ci.input) || [],
          deviceOutput: machine.connectionOutputs?.map(co => co.output) || [],
          machine: {
            id: machine.id,
            name: machine.name,
          }
        }
      };

      return transformed;
    } catch (error) {
      console.log("machine not found")
      throw new ForbiddenException('Access denied: Machine Not Found');
    }

  }


  async findMachineByType(tenantId: number, machineTypeId: number, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      return await tenantDb.query.machine.findMany(
        {
          where: and(
            eq(machine.tenantId, tenantId),
            eq(machine.typeId, machineTypeId)
          ),
        }
      );
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw new ForbiddenException('Access denied: No permissions found');
    }
  }
  async findMachine(tenantId: number, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);

    try {
      return await tenantDb.query.machine.findMany(
        {
          with: {
            connectionOutputs: {
              with: {
                output: true
              }
            },
            connectionInputs: {
              with: {
                input: true
              }
            }
          },
          where: eq(machine.tenantId, tenantId)
        }
      );
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw new ForbiddenException('Access denied: No permissions found');

    }
  }
  async updateMachine(data: MachineUpdateDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    let clearDashboard = false;
    const previousMachine = await tenantDb.query.machine.findFirst({
      where: eq(machine.id, data.id),
      with: {
        connectionInputs: true,
        connectionOutputs: true,
      },
    });
    
    const conInputs = previousMachine?.connectionInputs.map((item) => item.inputId) || [];
    const dataInputs = data.inputs?.map((item) => item.inputId) || [];

    if(!conInputs.every((item) => dataInputs.includes(item)) ) {
      clearDashboard = true;
    }
  
    console.log(clearDashboard," clearDashboard");
    
    try {
      await tenantDb
        .update(machine)
        .set({
          name: data.name,
          serial: data.serial,
          version: data.version,
          layout:clearDashboard ? "" : previousMachine.layout,
          widget: clearDashboard ? "" : previousMachine.widget,
        })
        .where(eq(machine.id, data.id));

      await tenantDb.delete(schema.connectionInputs).where(eq(schema.connectionInputs.machineId, data.id));
      await tenantDb.delete(schema.connectionOutputs).where(eq(schema.connectionOutputs.machineId, data.id));
      if (data.inputs?.length) {
        await tenantDb.insert(schema.connectionInputs).values(
          data.inputs.map((item) => ({
            inputId: item.inputId,
            machineId: data.id,
          }))
        );
      }
      if (data.outputs?.length) {
        await tenantDb.insert(schema.connectionOutputs).values(
          data.outputs.map((item) => ({
            outputId: item.outputId,
            machineId: data.id,
          }))
        );
      }
      return 'Success';
    } catch (error) {
      throw error;
    }
  }
  async updateMachineType(data: MachineTypeUpdateDto, tenantSlug: string) {
    const tenantDb = await this.tenant.getTenantConnection(tenantSlug);
    try {
      if (data.name) {
        await tenantDb.update(machine_type).set(data).where(eq(machine_type.id, data.id));
      } else {
        throw new Error('Machine type name is required');
      }
      return 'Success';
    } catch (error) {
      throw error;
    }
  }
  async deleteMachineDashboard(id: number) {
    try {
      await this.db.update(machine).set({
        layout: "",
        widget: "",
      }).where(eq(machine.id, id)).execute();
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
}
