import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersRepository, UserService],
  controllers: [UsersController],
  exports: [],
})
export class UsersModule {}
