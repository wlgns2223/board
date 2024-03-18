import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { InternalServerException } from '../exception/serviceException';

export const RefreshTokenFromReq = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenName = process.env.REFRESH_TOKEN_NAME;
    const refreshToken = request.cookies[tokenName] as string | undefined;

    if (!refreshToken) {
      throw InternalServerException('Refresh Token is not found');
    }

    return refreshToken;
  },
);
