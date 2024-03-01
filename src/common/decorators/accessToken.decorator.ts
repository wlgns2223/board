import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AccessToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cookies = request.headers.cookie.split(' ') as string[];
    const rawAccessToken = cookies.find((cookie: string) =>
      cookie.includes('j_id'),
    );
    const accessToken = rawAccessToken?.split('=')[1].replace(';', '');
    // const refreshToken = cookies.find((cookie: string) =>
    //   cookie.includes('j_rid'),
    // );

    return accessToken;
  },
);
