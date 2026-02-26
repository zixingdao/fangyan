import { Controller, Post, Body, UseGuards, Get, Request, Ip } from '@nestjs/common';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 登录接口：1分钟内最多5次尝试
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    return this.authService.login(loginDto, ip);
  }

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 注册接口：1分钟内最多3次
  async register(@Body() registerDto: RegisterDto, @Ip() ip: string) {
    return this.authService.register(registerDto, ip);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
