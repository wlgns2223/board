import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
} from '../common/exception/serviceException';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async findUserById(id: string) {
    return await this.userRepository.findUserById(id);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw EntityNotFoundException(email);
    }
    return user;
  }

  async createUser(createDto: CreateUserDto) {
    const found = await this.userRepository.getUserByEmail(createDto.email);
    if (found) {
      throw EntityAlreadyExistsException('user already exists');
    }

    const user = createDto.toEntity();
    await user.hashPassword(createDto.password);

    return await this.userRepository.createUser(user);
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    return await this.userRepository.updateUser(email, updateUserDto);
  }

  async deleteUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    return await this.userRepository.deleteUserByEmail(email);
  }
}
