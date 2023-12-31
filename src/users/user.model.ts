import { Exclude } from 'class-transformer';

export interface UserAttrs
  extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}

export class User {
  id: string;

  email: string;

  nickname: string;

  @Exclude()
  password: string;

  createdAt: Date;

  updatedAt: Date;

  constructor(partial: User) {
    Object.assign(this, partial);
  }

  static fromPlain(plain: Partial<User>): User {
    return new User({
      createdAt: new Date(),
      updatedAt: new Date(),
      email: '',
      id: '',
      nickname: '',
      password: '',
      ...plain,
    });
  }
}
