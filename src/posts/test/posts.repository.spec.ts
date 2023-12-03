import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from '../posts.repository';
import { DBService } from '../../database/db.service';
import { Post } from '../posts.model';
import { CreatePostDto } from '../dto/createPost.dto';
import { QueryHelper } from '../../common/utils/queryHelper';

describe('PostsRepository', () => {
  let postsRepository: PostsRepository;
  const queryMock = jest.fn();
  const helpInsertMock = jest.fn();
  const getLastInsertedRowMock = jest.fn();
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
            getLastInsertedRow: getLastInsertedRowMock,
          },
        },
      ],
    }).compile();
    postsRepository = module.get<PostsRepository>(PostsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    const sql = `INSERT INTO posts (id, authorId, title, content) VALUES (?, ?, ?, ?)`;
    queryMock.mockResolvedValue([fakePost]);
    helpInsertMock.mockReturnValue({
      columns: '(id, authorId, title, content)',
      values: ['1', 'fakeAuthorId', 'fakeTitle', 'fakeContent'],
      placesholders: '(?, ?, ?, ?)',
    });
    getLastInsertedRowMock.mockResolvedValue([fakePost]);

    const result = await postsRepository.createPost(dto);

    expect(result).toEqual(fakePost);
    expect(queryMock).toHaveBeenCalledWith(sql, [
      '1',
      dto.authorId,
      dto.title,
      dto.content,
    ]);
  });

  it('should create a column,value, placeholder string from object', () => {
    const obj = {
      id: '1234',
      title: 'title',
      content: 'content',
    };
    const queryHelper = new QueryHelper(obj);

    const column = queryHelper.toColumns();
    const value = queryHelper.toValues();
    const placeholder = queryHelper.toPlaceholders();

    expect(column).toEqual('(id,title,content)');
    expect(value).toEqual(['1234', 'title', 'content']);
    expect(placeholder).toEqual('(?,?,?)');
  });
});
