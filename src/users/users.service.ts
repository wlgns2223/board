import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private userRepository: UsersRepository) {}

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }

  async createUser(email: string, password: string) {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    const result = await this.userRepository.createUser(email, hashed);
    return result;
  }
}
