import { IsNotEmpty } from 'class-validator';
import { PostAttrs } from '../posts.model';

export class CreatePostDto implements PostAttrs {
  @IsNotEmpty()
  authorId: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  title: string;
}
