import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ITokenPayload, TokenPayload, TokenService } from './token.service';
import { UnmatchedPassword } from '../common/exception/serviceException';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { RefreshToken } from '../users/token.model';
import { TokenExceptionType } from './types/tokenError.type';
import { TokenException, TokenType } from '../common/exception/auth.exception';
import { User } from '../users/user.model';

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

    const accessToken = await this.signAccessToken(userEmail);
    const refreshToken = await this.signRefreshToken(userEmail);
    await this.tokenService.storeToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }

  async signAccessToken(userEmail: string) {
    const payload = new TokenPayload(userEmail);
    return await this.tokenService.signAccessToken(payload.toPlain());
  }

  async signRefreshToken(userEmail: string) {
    const payload = new TokenPayload(userEmail);
    return await this.tokenService.signRefreshToken(payload.toPlain());
  }

  async verifyToken(token: string, tokenType: TokenType = 'access') {
    try {
      return await this.tokenService.verifyToken(token);
    } catch (error) {
      this.logger.error(error);
      this.logger.error('token: ', token);
      if (error instanceof TokenExpiredError) {
        throw TokenException(TokenExceptionType.EXPIRED, tokenType);
      } else if (error instanceof JsonWebTokenError) {
        throw TokenException(
          !!token
            ? TokenExceptionType.INVALID_TOKEN
            : TokenExceptionType.UNDEFINED,
          tokenType,
        );
      } else {
        throw TokenException(error.message, tokenType);
      }
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
