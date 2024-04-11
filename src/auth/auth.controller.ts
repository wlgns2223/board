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
import { Request, Response } from 'express';
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
