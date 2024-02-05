import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';

export interface ITokenPayload {
  sub: string;
}

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async signToken(payload: ITokenPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return {
      accessToken,
      refreshToken,
    };
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
