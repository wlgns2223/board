import { IsEmail, IsNotEmpty } from 'class-validator';
import { User } from '../user.model';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;

  toEntity() {
    return User.from(this.email, this.nickname, this.password);
  }
}
