import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';

@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.usersService.createUser(dto);
  }

  @Put(':email')
  async updateUser(@Param('email') email: string, @Body() dto: UpdateUserDto) {
    return await this.usersService.updateUser(email, dto);
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @Delete(':email')
  async deleteUserByEmail(@Param('email') email: string) {
    return await this.usersService.deleteUserByEmail(email);
  }
}
