export class Posts {
  postId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Posts) {
    Object.assign(this, partial);
  }

  static fromPlain(plain: Partial<Posts>): Posts {
    return new Posts({
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
