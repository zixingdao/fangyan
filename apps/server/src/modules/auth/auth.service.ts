import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto, LogType, LogLevel } from '@changsha/shared';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logsService: LogsService,
  ) {}

  async validateUser(student_id: string, pass: string): Promise<any> {
    const user = await this.usersService.findByStudentId(student_id);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, ip?: string) {
    const user = await this.validateUser(loginDto.student_id, loginDto.password);
    if (!user) {
      // 记录登录失败日志
      await this.logsService.create(
        null, 
        '登录失败', 
        LogType.USER_ACTION, 
        LogLevel.WARN, 
        JSON.stringify({ student_id: loginDto.student_id, reason: '密码错误或用户不存在' }), 
        ip
      );
      throw new UnauthorizedException('学号或密码错误');
    }
    
    const payload = { sub: user.id, student_id: user.student_id, role: user.role };
    
    // 记录登录成功日志
    await this.logsService.create(
      user.id, 
      '用户登录', 
      LogType.USER_ACTION, 
      LogLevel.INFO, 
      JSON.stringify({ student_id: user.student_id }), 
      ip
    );

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto, ip?: string) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    const { password, ...result } = user;

    // 记录注册日志
    await this.logsService.create(
      user.id, 
      '用户注册', 
      LogType.USER_ACTION, 
      LogLevel.INFO, 
      JSON.stringify({ student_id: user.student_id, name: user.name }), 
      ip
    );

    return result;
  }
}
