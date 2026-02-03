import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow<string>('JWT_REFRESH_SECRET'), // Key của Refresh Token
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const authHeader = req.get('authorization');
    if (!authHeader) throw new ForbiddenException('Refresh token missing');
    const refreshToken = authHeader.replace('Bearer', '').trim();
    
    if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
    
    return {
      ...payload,
      refreshToken, // Trả về cả user info LẪN chuỗi token để Service so sánh
    };
  }
}