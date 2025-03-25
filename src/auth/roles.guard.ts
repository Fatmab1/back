import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
  
    console.log('✅ Rôle requis:', requiredRoles);
    console.log('✅ Rôle utilisateur:', user.role);
  
    if (!requiredRoles) {
      return true;
    }
  
    return requiredRoles.includes(user.role);
  }
}  