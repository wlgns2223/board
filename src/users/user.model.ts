import { Exclude } from 'class-transformer';
import { MissingDataException } from '../common/exception/serviceException';
import * as bcrypt from 'bcrypt';

export interface UserAttrs
  extends Omit<User, 'id' | 'createdAt' | 'updatedAt'> {}

export class User {
  id: string;

  email: string;

  nickname: string;

  password: string;

  createdAt: Date;

  updatedAt: Date;

  static from(email: string, nickname: string, password): User {
    const user = new User();
    user.email = email;
    user.nickname = nickname;
    user.password = password;

    return user;
  }

  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    this.password = hashed;
  }

  public async comparePassword(passwordToCompare: string) {
    return await bcrypt.compare(passwordToCompare, this.password);
  }
}
