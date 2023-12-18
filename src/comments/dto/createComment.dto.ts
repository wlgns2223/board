import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Comment, CommentEntity } from '../comment.entity';

export class CreateCommentDto implements Comment {
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

  toEntity() {
    return new CommentEntity({
      content: this.content,
      parentId: this.parentId,
      postId: this.postId,
      userId: this.userId,
    });
  }
}
