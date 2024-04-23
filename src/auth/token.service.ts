import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';
import { TokenRepository } from '../users/token.repository';
import { ConfigService } from '@nestjs/config';

export interface ITokenPayload {
  // email
  sub: string;
}

export interface IJWTPayload extends ITokenPayload {
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
    private configService: ConfigService,
  ) {}

  async signAccessToken(payload: ITokenPayload) {
    return await this.generateToken(payload, '10s');
  }

  async signRefreshToken(payload: ITokenPayload) {
    return await this.generateToken(payload, '7d');
  }

  async generateToken(payload: ITokenPayload, expiresIn: string) {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  /**
   *  Access Token이
   *  만료되지 않으면 Payload를 리턴하고
   *  만료되었다면 verifyAsync 함수가 에러를 던진다. TokenExpiredError: jwt expired
   *  잘못된 토큰이라면 TokenExpiredError: invalid token
   */
  async verifyToken(token: string) {
    return await this.jwtService.verifyAsync<IJWTPayload>(token, {
      secret: this.configService.get('TOKEN_SECRET'),
    });
  }

  async storeToken(token: string, userId: string) {
    return await this.tokenRepository.storeToken(token, userId);
  }

  async getToken(token: string, userId: string) {
    return await this.tokenRepository.getToken(token, userId);
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
