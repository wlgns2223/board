import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ITokenPayload, TokenPayload, TokenService } from './token.service';
import { UnmatchedPassword } from '../common/exception/serviceException';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { RefreshToken } from '../users/token.model';
import { TokenExceptionType } from './types/tokenError.type';
import { TokenException } from '../common/exception/auth.exception';

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
    await this.tokenService.storeToken(tokens.refreshToken, user.id);

    return tokens;
  }

  async verifyToken(token: string) {
    try {
      return await this.tokenService.verifyToken(token);
    } catch (error) {
      this.logger.error(error);
      this.logger.error('token: ', token);
      if (error instanceof TokenExpiredError) {
        throw TokenException(TokenExceptionType.EXPIRED);
      }

      if (error instanceof JsonWebTokenError) {
        throw TokenException(
          !!token
            ? TokenExceptionType.INVALID_TOKEN
            : TokenExceptionType.UNDEFINED,
        );
      }

      throw TokenException(error.message);
    }
  }

  async compareRefreshToken(refreshToken: RefreshToken) {
    const token = await this.tokenService.getToken(
      refreshToken.refreshToken,
      refreshToken.userId,
    );

    console.log(token);
  }
}
