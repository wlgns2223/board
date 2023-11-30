export interface PostAttrs
  extends Omit<Post, 'postId' | 'createdAt' | 'updatedAt'> {}

export class Post {
  postId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Post) {
    Object.assign(this, partial);
  }

  static fromPlain(plain: Partial<Post>): Post {
    return new Post({
      createdAt: new Date(),
      updatedAt: new Date(),
      postId: '',
      title: '',
      content: '',
      authorId: '',
      ...plain,
    });
  }
}
