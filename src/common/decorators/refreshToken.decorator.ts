import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { InternalServerException } from '../exception/serviceException';
import { TokenException } from '../exception/auth.exception';
import { TokenExceptionType } from '../../auth/types/tokenError.type';

export const RefreshTokenFromReq = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenName = process.env.REFRESH_TOKEN_NAME;
    const refreshToken = request.cookies[tokenName] as string | undefined;

    if (!refreshToken) {
      throw TokenException(TokenExceptionType.UNDEFINED, 'refresh');
    }

    return refreshToken;
  },
);
