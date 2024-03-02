import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ITokenPayload, TokenPayload, TokenService } from './token.service';
import {
  TokenException,
  UnmatchedPassword,
} from '../common/exception/serviceException';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  // 로그인
  async signIn(userEmail: string, password: string) {
    const user = await this.userService.getUserByEmail(userEmail);

    const doesPasswordMatch = await user.comparePassword(password);

    if (!doesPasswordMatch) {
      throw UnmatchedPassword('Password is not matched');
    }

    const payload = new TokenPayload(userEmail);
    const tokens = await this.tokenService.signToken(
      payload.toPlain<ITokenPayload>(),
    );
    // await this.tokenService.storeToken(tokens.refreshToken, user.id);

    return tokens.accessToken;
  }

  async verifyToken(token: string) {
    try {
      return await this.tokenService.verifyToken(token);
    } catch (error) {
      this.logger.error(error);
      throw TokenException('Access Token Expires');
    }
  }
}
