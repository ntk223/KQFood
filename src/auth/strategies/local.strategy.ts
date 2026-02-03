import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
        usernameField: 'userName', // Báo cho Passport biết ta dùng email để đăng nhập
        passwordField: 'password'
    });
  }

  async validate(userName: string, pass: string): Promise<any> {
    const user = await this.authService.validateUser(userName, pass);    
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }
    return user;
  }
}