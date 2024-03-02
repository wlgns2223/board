import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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
