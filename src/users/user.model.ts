import { Exclude } from 'class-transformer';

export class User {
  @Exclude()
  id: string;
  email: string;
  nickname: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: User) {
    Object.assign(this, partial);
  }

  static fromPlain(plain: User): User {
    return new User(plain);
  }
}
