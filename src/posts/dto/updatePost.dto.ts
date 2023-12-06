import { IsOptional, IsString } from 'class-validator';
import { PostAttrs } from '../posts.model';

export class UpdatePostDto implements Partial<Omit<PostAttrs, 'authorId'>> {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
