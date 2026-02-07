import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '@/token/token.service';
import { comparePassword, hashPassword } from '@/utils/password.helper';
import { RegisterDto } from './dto/register.dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { createProfile } from '@/utils/createProfile.helper';
import { RoleType } from '@/constants/role';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly dataSource: DataSource,
  ) {}

  async getTokens(sub: number, roles: RoleType[]) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken({ sub, roles }),
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

      const {accessToken, refreshToken} = await this.getTokens(user.id, user.roles);      
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
        user.roles,
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

    async register(dto : RegisterDto) : Promise<any> {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        let resultUser;
        const existingUser = await queryRunner
                              .manager
                              .findOne(User, { where: { email: dto.email } });
        const newRole = dto.role;
        if (existingUser) {
          resultUser = await this.userService.addRoleToUser(existingUser.id, newRole, 
                                                            dto.password, queryRunner.manager);
        }
        else {
          const user = new User();
          user.email = dto.email;
          user.fullName = dto.fullName;
          user.password = await hashPassword(dto.password);
          user.phone = dto.phone;
          user.avatar = dto?.avatar;
          user.roles = [newRole];
          resultUser = await queryRunner.manager.save(User, user);
          // Create profile based on role
          await createProfile(queryRunner.manager, newRole, resultUser.id);
        }
        await queryRunner.commitTransaction();
        return resultUser;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      }
      finally {
        await queryRunner.release();
      }
    }
}
