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
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { BaseResponse } from '../common/response/base';
import { UserWithoutPassword } from './user.types';
import { UserDto } from './dto/user.dto';
import { User } from './user.model';

@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private usersService: UsersService) {}

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.usersService.getUserByEmail(email);
    const userDto = UserDto.from(user);
    return BaseResponse.of<{ user: UserDto }>({ user: userDto });
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const userEntity = await this.usersService.createUser(dto);
    const userDto = UserDto.from(userEntity);
    return BaseResponse.of<{ user: UserDto }>({ user: userDto });
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
