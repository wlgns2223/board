import {
  Body,
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from '../common/decorators/accessToken.decorator';
import { RefreshTokenFromReq } from '../common/decorators/refreshToken.decorator';
import { RefreshToken } from '../users/token.model';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private getTokenName(tokenType: 'ACCESS' | 'REFRESH') {
    const tokenName = this.configService.get(`${tokenType}_TOKEN_NAME`);
    if (!tokenName) {
      throw new InternalServerErrorException('Wrong Configure !');
    }
    return tokenName;
  }

  private setCookie(
    res: Response,
    tokenName: string,
    token: string,
    cookieOption: CookieOptions,
  ) {
    res.cookie(tokenName, token, cookieOption);
  }

  @Post()
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const accessTokenName = this.getTokenName('ACCESS');
    const refreshTokenName = this.getTokenName('REFRESH');

    const tokens = await this.authService.signIn(dto.email, dto.password);

    const commonCookieOption: CookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'none',
    };

    this.setCookie(
      res,
      accessTokenName,
      tokens.accessToken,
      commonCookieOption,
    );
    this.setCookie(
      res,
      refreshTokenName,
      tokens.refreshToken,
      commonCookieOption,
    );

    return res.json({
      message: 'success',
    });
  }

  @UseGuards(AuthGuard)
  @Get('test')
  async test() {
    return 'test';
  }

  @Post('renew-access-token')
  async renew(@RefreshTokenFromReq() refreshToken: string) {
    const payload = await this.authService.verifyToken(refreshToken);
    console.log(payload);
    const newAccessToken = await this.authService.compareRefreshToken(
      RefreshToken.from(payload.sub, refreshToken),
    );
  }
}
