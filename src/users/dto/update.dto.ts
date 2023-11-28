import { IsEmail, IsOptional } from 'class-validator';
import { CreateUserDto } from './create.dto';

export class UpdateUserDto
  implements Partial<Omit<CreateUserDto, 'email' | 'password'>>
{
  @IsOptional()
  nickname?: string;
}
