import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InternalServerException } from '../exception/serviceException';

export const AccessToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const tokenName = process.env.ACCESS_TOKEN_NAME;
    const accessToken = request.cookies[tokenName] as string | undefined;

    if (!accessToken) {
      throw InternalServerException('Access Token is not found');
    }

    return accessToken;
  },
);
