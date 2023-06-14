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
export class CanDeleteWordGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<{ user: UserModel; params: any }>();

    const { user, params } = request;

    const hasAdminRole = () => user.roles.some((role) => role === Role.Admin);

    const isHisDictionary = params.userId === user._id;

    return isHisDictionary || hasAdminRole();
  }
}
