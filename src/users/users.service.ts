import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create.dto';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async createUser(createDto: CreateUserDto) {
    const user = await this.userRepository.getUserByEmail(createDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(createDto.password, salt);

    return await this.userRepository.createUser({
      ...createDto,
      password: hashed,
    });
  }
}
