import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommentEntity } from '../comment.entity';
import { Expose } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

interface IDTO<T> {
  toEntity: () => T;
}

export class CreateCommentDto implements IDTO<CommentEntity> {
  constructor() {}

  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  postId: string;

  @IsString()
  @IsOptional()
  @Expose()
  parentId: string | null;

  static of(
    content: string,
    userId: string,
    postId: string,
    parentId: string | null,
  ) {
    const dto = new CreateCommentDto();
    dto.content = content;
    dto.userId = userId;
    dto.postId = postId;
    dto.parentId = parentId;
    return dto;
  }

  toEntity() {
    return new CommentEntity({
      id: uuidv4(),
      content: this.content,
      parentId: this.parentId,
      postId: this.postId,
      userId: this.userId,
    });
  }
}
