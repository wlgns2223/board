import {
  Body,
  Controller,
  Header,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AccessToken } from '../common/decorators/accessToken.decorator';
import { RefreshTokenFromReq } from '../common/decorators/refreshToken.decorator';
import { RefreshToken } from '../users/token.model';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post()
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const accessTokenName = this.configService.get('ACCESS_TOKEN_NAME');
    if (!accessTokenName) {
      throw new InternalServerErrorException('Wrong Configure !');
    }
    const refreshTokenName = this.configService.get('REFRESH_TOKEN_NAME');
    if (!refreshTokenName) {
      throw new InternalServerErrorException('Wrong Configure !');
    }

    const tokens = await this.authService.signIn(dto.email, dto.password);

    res.cookie(accessTokenName, tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    res.cookie(refreshTokenName, tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    return res.json({
      message: 'success',
    });
  }

  @Post('verify')
  async verify(@AccessToken() token: string, @Res() res: Response) {
    /**
     *  1. Refresh Token을 확인한다. Refresh Token이 없거나 만료 된 경우 에러를 리턴한다.
     *   const isRefrshTokenValid = await this.authService.verifyRefreshToken(userId)
     *   if(isRefrshTokenValid){
     *      throw SomeCustomError()
     *    }
     *
     *    const newAccesToken = await this.authService.renewAccessToken(userId)
     *    res.cookie(tokenName,token, options)
     *    res.json({message:'success'})
     *
     */

    const payload = await this.authService.verifyToken(token);

    return res.json({
      message: 'success',
      data: {
        payload,
      },
    });
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
