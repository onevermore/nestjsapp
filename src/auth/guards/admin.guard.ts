import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserModel } from 'src/user/user.model';

@Injectable()
export class OnlyAdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: UserModel }>();
    const user = request.user;
    console.log('user DATA ===== ', user);
    /*  if (!user?.isAdmin) throw new ForbiddenException('Onky for admins!');

    return user?.isAdmin;*/
    return false;
  }
}
