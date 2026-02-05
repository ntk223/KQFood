import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '@/token/token.service';
import { comparePassword, hashPassword } from '@/utils/password.helper';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async getTokens(sub: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ sub, email }),
      this.tokenService.signRefreshToken({ sub }),
    ]);
    
    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const foundUser = await this.userService.findOneByEmail(email); // Tìm user trong DB
    
    if (!foundUser) {
        return null;
    }
    const isValid = await comparePassword(pass, foundUser.password);
    
    if (!isValid) {
        return null;
    }

    const { password, ...result } = foundUser;
    return result;
  }
  async login(user: any) {

      const {accessToken, refreshToken} = await this.getTokens(user.id, user.email);      
      await this.updateRtHashed(user.id, refreshToken);
      return {
        access_token: accessToken, // Tạo chuỗi token mã hóa
        refresh_token: refreshToken,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles
        }
      };
    }

    async updateRtHashed(userId: number, rt: string) {
      const hash = await hashPassword(rt);
      await this.userService.updateRtHashed(userId, hash);
    }

    async refreshTokens(userId: number, rt: string) {
      const user = await this.userService.findById(userId);
      
      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Access Denied 1');
      }
      const rtMatches = await comparePassword(rt, user.refreshTokenHash);
      if (!rtMatches) {
        throw new UnauthorizedException('Access Denied');
      }
      const { accessToken, refreshToken } = await this.getTokens(
        user.id,
        user.email,
        // user.roles.join(','),        
      );
      await this.updateRtHashed(user.id, refreshToken);
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    async logout(userId: number) : Promise<void> {
      return this.userService.updateRtHashed(userId, null);
    }

    async register(user : RegisterDto) : Promise<any> {
      const checkExistEmail = await this.userService.checkExistByEmail(user.email);
      if (checkExistEmail) {
        throw new UnauthorizedException('Email already exists');
      }
      return this.userService.create(user);
    }
}
