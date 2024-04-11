import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const tokenName = this.configService.get('ACCESS_TOKEN_NAME') as string;
    const accesToken = req.cookies[tokenName];

    const result = await this.authService.verifyToken(accesToken);

    return !!result;
  }
}

/**
 *  verifyToken이 만료, 유효하지 않은 토큰에 대해서 에러를 던진다.
 *  유효하다면 payload를 반환한다. 즉 payload만 있다면 API를 실행해도 된다.
 */
