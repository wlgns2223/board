export abstract class BaseEntityInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  constructor(id: string) {
    this.id = id;
  }
}

export class CommentEntity extends BaseEntityInterface {
  content: string;
  userId: string;
  postId: string;
  parentId: string | null;
  constructor(params: {
    id: string;
    content: string;
    userId: string;
    postId: string;
    parentId: string | null;
  }) {
    super(params.id);
    this.content = params.content;
    this.userId = params.userId;
    this.postId = params.postId;
    this.parentId = params.parentId;
  }

  // TypeORM 안써서, 필요없는 테크닉임

  // static from(fields: {
  //   content: string;
  //   userId: string;
  //   postId: string;
  //   parentId: string | null;
  // }) {
  //   const comment = new CommentEntity(
  //     fields.content,
  //     fields.userId,
  //     fields.postId,
  //     fields.parentId,
  //   );

  //   return comment;
  // }
}
