import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/user/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<Role[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

   // console.log('requiredRoles === ', requiredRoles);

    const request = context.switchToHttp().getRequest<{ user: UserModel }>();
    const user = request.user;
   // console.log('user DATA roles ===== ', user);
    const hasRole = () =>
      user.roles.some((role) => requiredRoles.includes(role));
    return user && user.roles && hasRole();

    /*  if (!user.isAdmin) throw new ForbiddenException('Onky for admins!');

    return user.isAdmin;*/

    /* 

  
    const hasRole = () =>
      user.roles.some((role) => requiredRoles.includes(role));
    return user && user.roles && hasRole();*/
  }
}
