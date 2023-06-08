import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from 'src/user/enums/role.enum';
import { TypeRole } from '../auth.interface';
import { OnlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth2(roles: Role[] = [Role.User]) {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard));
}
