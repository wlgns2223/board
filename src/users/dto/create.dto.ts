import { IsEmail, IsNotEmpty } from 'class-validator';
import { User, UserAttrs } from '../user.model';

export class CreateUserDto implements UserAttrs {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;
}
