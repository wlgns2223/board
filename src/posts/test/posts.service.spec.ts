import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from '../posts.service';
import { PostsRepository } from '../posts.repository';
import { UsersService } from '../../users/users.service';
import { CreatePostDto } from '../dto/createPost.dto';
import { User, UserAttrs } from '../../users/user.model';
import { BadRequestException } from '@nestjs/common';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: PostsRepository;
  let usersService: UsersService;
  const findUserByIdMock = jest.fn();
  const findPostByIdMock = jest.fn();
  const createPostMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            findPostById: findPostByIdMock,
            createPost: createPostMock,
          },
        },
        {
          provide: UsersService,
          useValue: {
            findUserById: findUserByIdMock,
          },
        },
      ],
    }).compile();
    postsService = module.get<PostsService>(PostsService);
    postsRepository = module.get<PostsRepository>(PostsRepository);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  it('should create a post', async () => {
    const dto: CreatePostDto = {
      authorId: 'fakeAuthorId',
      title: 'fakeTitle',
      content: 'fakeContent',
    };
    const id = '1234';
    const fakeUser: Partial<User> = {
      id: 'fakeId',
      email: 'fakeEmail',
      nickname: 'fakeNickname',
    };

    const expected = {
      postId: id,
      title: dto.title,
      content: dto.content,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      userId: fakeUser.id,
      email: fakeUser.email,
      nickname: fakeUser.nickname,
    };

    findUserByIdMock.mockResolvedValue(fakeUser);
    createPostMock.mockResolvedValue(expected);

    const result = await postsService.createPost(dto);

    expect(findUserByIdMock).toHaveBeenCalledWith(dto.authorId);
    expect(createPostMock).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it("should throw an error if user doesn't exist", async () => {
    const dto: CreatePostDto = {
      authorId: 'fakeAuthorId',
      title: 'fakeTitle',
      content: 'fakeContent',
    };
    findUserByIdMock.mockResolvedValue(undefined);

    await expect(postsService.createPost(dto)).rejects.toThrow(
      BadRequestException,
    );
    await expect(postsService.createPost(dto)).rejects.toThrow(
      'User not found',
    );
  });

  it('should get a post by postId', async () => {
    const postId = 'fakePostId';
    const expected = {
      postId,
      title: 'fakeTitle',
      content: 'fakeContent',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      userId: 'fakeUserId',
      email: 'fakeEmail',
      nickname: 'fakeNickname',
    };
    findPostByIdMock.mockResolvedValue(expected);

    const result = await postsService.findPostById(postId);

    expect(findPostByIdMock).toHaveBeenCalledWith(postId);
    expect(result).toEqual(expected);
  });
});
