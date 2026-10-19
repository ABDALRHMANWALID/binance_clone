import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  id: string;
}

export const CurrentUser = createParamDecorator(
  (key: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as AuthUser | undefined;
    return key ? user?.[key] : user;
  },
);
