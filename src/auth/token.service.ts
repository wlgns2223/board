import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { TokenRepository } from '../users/token.repository';
import { ConfigService } from '@nestjs/config';

export interface ITokenPayload {
  sub: string;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
    private configService: ConfigService,
  ) {}

  async signToken(payload: ITokenPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync<ITokenPayload>(token, {
      secret: this.configService.get('TOKEN_SECRET'),
    });
  }

  async storeToken(token: string, userId: string) {
    return await this.tokenRepository.storeToken(token, userId);
  }
}

export class TokenPayload {
  @Exclude() private _sub: string;
  constructor(sub: string) {
    this._sub = sub;
  }

  @Expose()
  get sub() {
    return this._sub;
  }

  toPlain<T>() {
    return instanceToPlain(this) as T;
  }
}
