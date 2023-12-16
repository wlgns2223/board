import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommentAttr } from '../comment.model';

export class CreateCommentDto implements CommentAttr {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsOptional()
  parentId: string;
}
