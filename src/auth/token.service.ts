import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface ITokenPayload {
  sub: string;
}

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async signToken(payload: ITokenPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {});
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
  private _sub: string;
  constructor(sub: string) {
    this._sub = sub;
  }

  get sub() {
    return this._sub;
  }
}
