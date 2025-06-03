import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Param,
  Put,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateNewUserDto, CreateUserDto, UpdateUserDto, UserResponseDto } from './users.dto';
import { AccessTokenGuard } from '../common/guards/auth.guards';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionsGuard } from 'src/common/guards/licencePermission.guard';
import { AuthService } from 'src/auth/auth.service';
import { TenantService } from './tenant.service';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AccessTokenGuard, RolesGuard, PermissionsGuard)
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly tenantService: TenantService,
    private readonly usersService:UsersService,
  ) {}

  @Get()
  async handleGetAllUsers(@Query() query) {
    const users = await this.usersService.getUsers(query.tenantId);
    return plainToInstance(UserResponseDto, users);
  }

  @Put()
  async handleUpdateUser(@Req() req: Request, @Body() data: CreateUserDto) {
    const slug = req['tenantSlug'];
    if (!slug) throw new BadRequestException('Tenant DB connection not found');

    if (!data.email) throw new BadRequestException('Email is required');
    const exists = await this.usersService.getUserByEmail(data.email,slug);
    if (!exists) throw new BadRequestException('Email is not registered');

    if (!data.password) throw new BadRequestException('Password not set');
    const hashedPassword = await this.authService.generatePassword(data.password);
    if (!hashedPassword) throw new BadRequestException('Problem with credential hashing');

    const user = await this.usersService.updatePassword(data.email, hashedPassword,slug);
    return plainToInstance(UserResponseDto, user);
  }
  @Put("/update")
  async handleUpdateUserInfo(@Req() req: Request, @Body() data: UpdateUserDto) {
    const slug = req['tenantSlug'];
    if (!slug) throw new BadRequestException('Tenant DB connection not found');

    if (!data.email) throw new BadRequestException('Email is required');
    const exists = await this.usersService.getUserByEmail(data.email,slug);
    if (!exists) throw new BadRequestException('Email is not registered');
    const userData = await this.usersService.findUserById(data.id,slug)
    let pass =userData.password
    if(data.password)
    {const hashedPassword = await this.authService.generatePassword(data.password);
    if (!hashedPassword) throw new BadRequestException('Problem with credential hashing');
    pass = hashedPassword
  }
  
  const dataUser = {...data,password:pass}  
    const user = await this.usersService.updateUserInfo(dataUser,slug);
    return plainToInstance(UserResponseDto, user);
  }
  @Post()
  async handleCreateUser(@Body() data: CreateUserDto) {
    
    if (!data.email) throw new BadRequestException('Email is required');
    if (!data.tenantName) throw new BadRequestException('tenantName is required');

    const tenantExists = await this.tenantService.getTenantByName(data.tenantName);
    if (tenantExists) throw new BadRequestException('Workspace name already in use');

    const user = await this.usersService.createUser(data);
    return plainToInstance(UserResponseDto, user);
  }
  @Post("/newUser")
  async handleCreateNewUser(@Body() data: CreateNewUserDto) {
    
    if (!data.email) throw new BadRequestException('Email is required');
    if (!data.tenantName) throw new BadRequestException('tenantName is required');

    const tenantExists = await this.tenantService.getTenantByName(data.tenantName);
    if (!tenantExists) throw new BadRequestException('Workspace does not exist');

    return await this.usersService.createNewUser(data);
   
  }

  @Delete(':id')
  async handleDeleteUser(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const slug = req['tenantSlug'];
    if (!slug) throw new BadRequestException('Tenant DB connection not found');

    const exists = await this.usersService.getUserById(id,slug);
    if (!exists) throw new BadRequestException('User does not exist');

    const user = await this.usersService.deleteUser(id,slug);
    return plainToInstance(UserResponseDto, user);
  }
}
