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
  private commonCookieOption: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'none',
  };
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post()
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const accessTokenName = this.getTokenName('ACCESS');
    const refreshTokenName = this.getTokenName('REFRESH');

    const tokens = await this.authService.signIn(dto.email, dto.password);

    this.setCookie(
      res,
      accessTokenName,
      tokens.accessToken,
      this.commonCookieOption,
    );
    this.setCookie(
      res,
      refreshTokenName,
      tokens.refreshToken,
      this.commonCookieOption,
    );

    return res.json({
      message: 'success',
    });
  }

  @Post('renew')
  async renew(
    @Res() res: Response,
    @RefreshTokenFromReq() refreshToken: string,
  ) {
    const payload = await this.authService.verifyToken(refreshToken, 'refresh');

    const accessTokenName = this.getTokenName('ACCESS');
    const newAccessToken = await this.authService.signAccessToken(payload.sub);
    this.setCookie(
      res,
      accessTokenName,
      newAccessToken,
      this.commonCookieOption,
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
}
