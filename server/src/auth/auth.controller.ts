import { Controller, Post, Body, Delete, UseGuards, Get, Query, BadRequestException, NotFoundException, Req, Res, Param } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetUser } from '../common/decorators';
import {
  GetLoggedInUserResponseDto,
  LoginUserRequestDto,
  RegisterUserRequestDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from 'src/common/guards/auth.guards';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Get('me')
  @UseGuards(AccessTokenGuard)
  async handleMeRequest(@GetUser('sub') userId, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    const user = await this.authService.getLoggedInUser(userId);

    return plainToClass(GetLoggedInUserResponseDto, user);
  }

  @Post('login')
  async handleLoginRequest(@Body() data: LoginUserRequestDto, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    return this.authService.loginUser(data);
  }
  @Post('updateToken')
  async updateTenantToken(@Body() data: any) {
    return this.authService.updateTenantToken(data);
  }

  @Get('verify')
  async verifyUser(@Query('token') token: string, @Req() req: Request, @Res() res) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    console.log("verify")
    const tenantSlug = req['tenantSlug'];
    console.log(tenantSlug)
    const result = await this.authService.verifyEmail(token);
    if (!result) {
      throw new NotFoundException('Invalid or expired token');
    }

    return res.redirect(process.env.SERVER_PRIMARY_DNS);
  }
  @Post('verifyUser/:id')
  async verifyUserAdmin(@Param('id') id: number, @Req() req: Request, @Res() res) {

    console.log("verify")
    const tenantSlug = req['tenantSlug'];
    console.log(tenantSlug)
    const result = await this.authService.verifyEmailByGAdmin(id);
    if (!result) {
      throw new NotFoundException('Invalid User');
    }
    return true
    // return res.redirect(process.env.SERVER_PRIMARY_DNS);
  }
  @Post('forgotPassword')
  async forgetPassword(@Body() data: any, @Req() req: Request, @Res() res) {

    console.log("forgetPassword")
    const tenantSlug = req['tenantSlug'];
    return await this.authService.forgetPassword(data);

  }
  @Post('resetPassword')
  async resetPassword(@Body() data: any, @Req() req: Request, @Res() res) {

    const tenantSlug = req['tenantSlug'];
    const result = await this.authService.resetPassword(data);
    if (!result) {
      return res.redirect(process.env.FORGOT_PASSWORD_URL);
    }

    return res.redirect(process.env.FORGOT_PASSWORD_URL);

  }

  @Post('register')
  async handleRegisterRequest(@Body() data: RegisterUserRequestDto, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    return this.authService.registerUser(data);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('logout')
  async handleLogoutRequest(@GetUser('sub') userId, @Req() req: Request) {
    const tenantSlug = req['tenantSlug'];
    await this.authService.logoutUser(userId);

    return true;
  }
}
