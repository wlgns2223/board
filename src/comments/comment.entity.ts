export interface BaseEntityInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  content: string;
  userId: string;
  postId: string;
  parentId: string | null;
}

export class CommentEntity implements Comment, BaseEntityInterface {
  createdAt: Date;
  id: string;
  updatedAt: Date;
  content: string;
  userId: string;
  postId: string;
  parentId: string | null;

  constructor(comment: Comment) {
    this.content = comment.content;
    this.userId = comment.userId;
    this.postId = comment.postId;
    this.parentId = comment.parentId;
  }
}
