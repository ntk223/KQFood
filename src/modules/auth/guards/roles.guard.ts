import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from '@/constants/role';
import { ROLES_KEY } from '@/decorator/customize';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách roles được khai báo trong @Roles() decorator
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu không có @Roles() decorator thì cho phép truy cập
    if (!requiredRoles) {
      return true;
    }

    // Lấy user từ request (đã được gán bởi JwtStrategy sau khi validate token)
    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.roles) {
      throw new ForbiddenException('Bạn không có quyền truy cập tài nguyên này');
    }

    // Kiểm tra xem user có ít nhất 1 role trong danh sách required roles không
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException(`Truy cập bị từ chối. Yêu cầu một trong các vai trò: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
