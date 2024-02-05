import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post()
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const tokens = await this.authService.signIn(dto.email, dto.password);

    const accessTokenName = this.configService.get('ACCESS_TOKEN_NAME');
    if (!accessTokenName) {
      throw new InternalServerErrorException(
        'ACCESS_TOKEN_NAME is not defined',
      );
    }

    res.cookie(accessTokenName, tokens.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
    });

    return res.json({
      message: 'success',
    });
  }
}
