import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TokenRepository } from '../users/token.repository';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('TOKEN_SECRET'),
        signOptions: {
          expiresIn: '30s',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, TokenRepository],
})
export class AuthModule {}
