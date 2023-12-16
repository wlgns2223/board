export interface CommentAttr
  extends Omit<Comment, 'id' | 'createdAt' | 'updatedAt'> {}

export class Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Comment) {
    Object.assign(this, partial);
  }

  static fromPlain(plain: Partial<Comment>): Comment {
    return new Comment({
      createdAt: new Date(),
      updatedAt: new Date(),
      content: '',
      id: '',
      parentId: '',
      postId: '',
      userId: '',
      ...plain,
    });
  }
}
