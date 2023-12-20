import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CommentEntity } from '../comment.entity';
import { PickType } from '@nestjs/mapped-types';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';

interface IDTO<T> {
  toEntity: () => T;
}

export class CreateCommentDto implements IDTO<CommentEntity> {
  @Exclude() private readonly _content: string;
  @Exclude() private readonly _userId: string;
  @Exclude() private readonly _postId: string;
  @Exclude() private readonly _parentId: string | null;

  constructor(
    content: string,
    userId: string,
    postId: string,
    parentId: string,
  ) {
    this._content = content;
    this._userId = userId;
    this._postId = postId;
    this._parentId = parentId;
  }

  @IsString()
  @IsNotEmpty()
  @Expose()
  get content(): string {
    return this._content;
  }

  @IsString()
  @IsNotEmpty()
  @Expose()
  get userId(): string {
    return this._userId;
  }

  @IsString()
  @IsNotEmpty()
  @Expose()
  get postId(): string {
    return this._postId;
  }

  @IsString()
  @IsOptional()
  @Expose()
  get parentId(): string {
    return this._parentId;
  }

  transform<T>() {
    return instanceToPlain(this) as T;
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
