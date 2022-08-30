import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
