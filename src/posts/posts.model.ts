export interface PostAttrs
  extends Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {}

export class Post {
  id: string;
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
      id: '',
      title: '',
      content: '',
      authorId: '',
      ...plain,
    });
  }
}
