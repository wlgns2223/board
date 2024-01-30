import { Controller, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';

@Controller('auth')
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post()
  async signIn(dto: SignInDto) {
    const tokens = await this.authService.signIn(dto.email, dto.password);

    return tokens;
  }
}
