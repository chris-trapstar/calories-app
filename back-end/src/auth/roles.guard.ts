
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import config from 'config';

import { Role } from './enums/role.enum';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const user = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || config.get('jwt.secret')
      });

      return requiredRoles.some(role => user.role == role);
    } else {
      throw new UnauthorizedException("No Auth Header Found");
    }
  }
}
