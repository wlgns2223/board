import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from '../posts.repository';
import { DBService } from '../../database/db.service';
import { Post } from '../posts.model';
import { CreatePostDto } from '../dto/createPost.dto';

describe('PostsRepository', () => {
  let postsRepository: PostsRepository;
  const queryMock = jest.fn();
  const helpInsertMock = jest.fn();
  const fakePost: Post = {
    id: '1',
    title: 'title',
    content: 'content',
    authorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: DBService,
          useValue: {
            query: queryMock,
            helpInsert: helpInsertMock,
          },
        },
      ],
    }).compile();
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  it('should be defined', () => {
    expect(postsRepository).toBeDefined();
  });

  it('should get a post by postId', async () => {
    const sql = `SELECT * FROM posts WHERE id = ? JOIN users ON posts.authorId = users.id`;
    queryMock.mockResolvedValue([fakePost]);

    const result = await postsRepository.getPostById(fakePost.id);
    expect(result).toEqual(fakePost);
    expect(queryMock).toHaveBeenCalledWith(sql, [fakePost.id]);
  });

  it('should create a post', async () => {
    const dto: CreatePostDto = {
      authorId: 'fakeAuthorId',
      title: 'fakeTitle',
      content: 'fakeContent',
    };
    const sql = `INSERT INTO posts (authorId, title, content) VALUES (?, ?, ?)`;
    queryMock.mockResolvedValue([fakePost]);
    helpInsertMock.mockReturnValue({
      columns: '(authorId, title, content)',
      values: ['fakeAuthorId', 'fakeTitle', 'fakeContent'],
      placesholders: '(?, ?, ?)',
    });

    const result = await postsRepository.createPost(dto);
    expect(result).toEqual(fakePost);
    expect(queryMock).toHaveBeenCalledWith(sql, [
      dto.authorId,
      dto.title,
      dto.content,
    ]);
  });

  it.todo('test lastInsertedRow on createPost');
});
