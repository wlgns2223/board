import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return this.userService.getUserByEmail(email);
  }
}
