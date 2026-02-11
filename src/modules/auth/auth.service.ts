import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '@/token/token.service';
import { comparePassword, hashPassword } from '@/utils/password.helper';
import { RegisterDto } from './dto/register.dto';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { createProfile } from '@/utils/createProfile.helper';
import { RoleType } from '@/constants/role';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly dataSource: DataSource,
    private readonly redisService: RedisService,
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
    const foundUser = await this.userService.findOneByEmail(email);
    
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
      // Lưu refresh token vào Redis
      await this.redisService.setRefreshToken(user.id, refreshToken);
      
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            roles: user.roles
        }
      };
    }

    async refreshTokens(userId: number, rt: string) {
      const user = await this.userService.findById(userId);
      
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Lấy refresh token từ Redis
      const storedToken = await this.redisService.getRefreshToken(userId);
      
      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // So sánh token
      if (rt !== storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Tạo token mới
      const { accessToken, refreshToken } = await this.getTokens(
        user.id,
        user.roles,
      );

      // Lưu refresh token mới vào Redis
      await this.redisService.setRefreshToken(user.id, refreshToken);
      
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    async logout(userId: number) : Promise<void> {
      // Xóa refresh token từ Redis
      await this.redisService.deleteRefreshToken(userId);
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
