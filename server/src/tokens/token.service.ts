/* eslint-disable prettier/prettier */
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { and, desc, eq, gt, lt } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../db/schema';
import { token } from '../../db/schema';
import moment, { relativeTimeRounding } from 'moment';
import { CreateTokenDto, EditTokenDto } from './token.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TokenService implements OnModuleInit {
  private logger = new Logger(TokenService.name);
  
  constructor(
    @Inject('DB_DEV') private readonly db:NodePgDatabase<typeof schema>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }
  async onModuleInit() { }

  async deleteToken(id: number) {
    try {
      await this.db.delete(token).where(eq(token.id, id)).execute();
      return 'Success';
    } catch (error) {
      return 'Error';
    }
  }
  

  async insertToken({user,tenantId,expiryDate,...data}: CreateTokenDto) {
    let expires = "7d" 
    switch (expiryDate) {
      case "day":
        expires = "1d"
        break;
      case "week":
        expires = "7d"
        break;
      case "month":
        expires = "30d"
        break;
      case "year":
        expires = "365d"
        break;
    
      default:
        break;
    }
   const _token = await  this.jwtService.signAsync(
    {
      sub: user.id,
      tenantId:tenantId,
      email: user.email,
      role: "",
      permissions: [],
    
   }, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: expires,
    })
    
    const tokenData = {
      ...data,tenantId,token:_token,expiryDate
    }
    try {
      await this.db.insert(token).values(tokenData).execute();
      return 'success'
    } catch (error) {
      console.log(error);
      throw error
    }
   
  }

 

  async updateToken(data:EditTokenDto) {
    return await this.db.update(token).set(
      {name:data.name,description:data.description}
    ).where(eq(token.id,data.id))
  }
  async findTokens(id: number) {
    console.log(id)
    const result=  await this.db.query.token.findMany({
      where:(_,{eq})=>eq(token.tenantId,id),
      
    })
    console.log("tokens",result)
    return result;

  }
  async findTokenById(id: number) {
    return await this.db.query.token.findFirst({
      where:(_,{eq})=>eq(token.id,id),
      
    })
  }
  
  
  
 
}
