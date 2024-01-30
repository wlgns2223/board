import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenPayload, TokenService } from './token.service';
import { UnmatchedPassword } from '../common/exception/serviceException';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  // 로그인
  async signIn(userEmail: string, password: string) {
    const user = await this.userService.getUserByEmail(userEmail);
    const doesPasswordMatch = user.comparePassword(password);
    if (!doesPasswordMatch) {
      throw UnmatchedPassword('Password is not matched');
    }

    const payload = new TokenPayload(userEmail);
    return await this.tokenService.signToken(payload);
  }
}
