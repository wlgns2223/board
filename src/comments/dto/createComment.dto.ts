import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommentEntity } from '../comment.entity';
import { PickType } from '@nestjs/mapped-types';

interface IDTO<T> {
  toEntity: () => T;
}

export class CreateCommentDto implements IDTO<CommentEntity> {
  private readonly _content: string;
  private readonly _userId: string;
  private readonly _postId: string;
  private readonly _parentId: string | null;

  @IsString()
  @IsNotEmpty()
  get content(): string {
    return this._content;
  }

  @IsString()
  @IsNotEmpty()
  get userId(): string {
    return this._userId;
  }

  @IsString()
  @IsNotEmpty()
  get postId(): string {
    return this._postId;
  }

  @IsString()
  @IsOptional()
  get parentId(): string {
    return this._parentId;
  }

  toEntity() {
    return new CommentEntity({
      content: this.content,
      parentId: this.parentId,
      postId: this.postId,
      userId: this.userId,
    });
  }
}
