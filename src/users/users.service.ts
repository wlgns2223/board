import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UsersRepository) {}

  async getUserByEmail(email: string) {
    return this.userRepository.getUserByEmail(email);
  }
}
