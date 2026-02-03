import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  // 3. Nếu Token hợp lệ, hàm này sẽ chạy
  async validate(payload: any) {
    // Payload chính là cái cục { sub, email, role } bạn đã nhét vào ở Bước 3
    // NestJS sẽ tự động gán kết quả trả về của hàm này vào `req.user`
    // console.log(payload);
    return { ...payload };
  }
}