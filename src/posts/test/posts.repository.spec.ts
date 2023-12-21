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
  const helpUpdateMock = jest.fn();
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
            helpUpdate: helpUpdateMock,
            getLastInsertedRow: getLastInsertedRowMock,
          } as Partial<DBService>,
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
    const sql = `SELECT P.id AS postId, title, content, P.createdAt, P.updatedAt, U.id AS userId, email, nickname  
    FROM posts AS P JOIN users AS U ON P.author_id = U.id WHERE P.id = "${fakePost.id}"`;
    queryMock.mockResolvedValue([fakePost]);

    const result = await postsRepository.findPostById(fakePost.id);
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
    queryMock.mockResolvedValue(fakePost);

    helpInsertMock.mockReturnValue({
      columns: '(id, authorId, title, content)',
      values: ['1', 'fakeAuthorId', 'fakeTitle', 'fakeContent'],
      placesholders: '(?, ?, ?, ?)',
    });
    getLastInsertedRowMock.mockResolvedValue(fakePost);

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

  it("should create update string from object's key and value", () => {
    const obj = {
      title: 'title',
      content: 'content',
    };
    const queryHelper = new QueryHelper(obj);
    const expected = `title = "title",content = "content"`;

    const update = queryHelper.toUpdate();

    expect(update).toEqual(expected);
  });

  it('should update a post by postId', async () => {
    const postId = 'fakePostId';
    const attrs = {
      title: 'fakeTitle',
      content: 'fakeContent',
    };
    const queryHelper = new QueryHelper(attrs);
    const update = queryHelper.toUpdate();
    const sql = `UPDATE posts SET ${update} WHERE id = "${postId}"`;

    const expected = {
      ...fakePost,
      ...attrs,
    };
    queryMock.mockResolvedValue(fakePost);
    helpUpdateMock.mockReturnValue(update);
    jest.spyOn(postsRepository, 'findPostById').mockResolvedValue(expected);

    const result = await postsRepository.updatePostById(postId, attrs);

    expect(result).toEqual(expected);
    expect(queryMock).toHaveBeenCalledWith(sql, [postId]);
  });

  it('should delete a post by postId', async () => {
    const postId = 'fakePostId';
    const sql = `DELETE FROM posts WHERE id = ?`;
    queryMock.mockResolvedValue(true);

    const result = await postsRepository.deletePostById(postId);

    expect(result).toEqual(true);
    expect(queryMock).toHaveBeenCalledWith(sql, [postId]);
  });

  it("should throw error when can't delete a post by postId", async () => {
    const postId = 'fakePostId';
    const sql = `DELETE FROM posts WHERE id = ?`;
    queryMock.mockRejectedValue(new Error('error'));
    // turn off error log
    jest.spyOn(postsRepository['logger'], 'error').mockImplementation(() => {});

    await expect(postsRepository.deletePostById(postId)).rejects.toThrow(
      new Error("Couldn't delete post"),
    );
    expect(queryMock).toHaveBeenCalledWith(sql, [postId]);
  });

  it('should show a paginated posts result', async () => {
    const page = 1;
    const limit = 20;
    const sql = `SELECT * FROM posts ORDER BY createdAt DESC LIMIT 20 OFFSET ?`;
    const fakePosts = Array.from({ length: limit }).map(() => fakePost);
    queryMock.mockResolvedValue(fakePosts);

    const result = await postsRepository.getPosts(page);

    expect(result).toHaveLength(limit);
    expect(result).toEqual(result);
    expect(queryMock).toHaveBeenCalledWith(sql, [page - 1]);
  });

  it('should throw an error if pagination query fails', async () => {
    jest.spyOn(postsRepository['logger'], 'error').mockImplementation(() => {});
    queryMock.mockRejectedValue(new Error("Coun't paginate posts"));
    const sql = `SELECT * FROM posts ORDER BY createdAt DESC LIMIT 20 OFFSET ?`;
    const page = 1;

    await expect(postsRepository.getPosts(page)).rejects.toThrow(
      new Error("Coun't paginate posts"),
    );
    expect(queryMock).toHaveBeenCalledWith(sql, [page - 1]);
  });
});
