import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../user.model';

export class CreateUserDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;
}
