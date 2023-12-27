import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../comments.service';
import { CommentRepository } from '../comments.repository';
import { UsersService } from '../../users/users.service';
import { PostsService } from '../../posts/posts.service';
import { CommentEntity } from '../comment.entity';
import { CreateCommentDto } from '../dto/createComment.dto';
import { User } from '../../users/user.model';
import { Post } from '../../posts/posts.model';
const fakeUUID = 'fakeUUID';
jest.mock('uuid', () => ({
  v4: () => fakeUUID,
}));

/**
 * Mocking 함수말고
 * Jest.Spyon을 사용해보자
 * 그리고 그에 대해 이번기회에 좀 더 자세히 학습해보자...
 */

describe('Comment Service', () => {
  let commentService: CommentService;
  let userService: UsersService;
  let postService: PostsService;
  let commentRepository: CommentRepository;
  const createCommentMock = jest.fn();
  const findUserByIdMock = jest.fn();
  const findPostByIdMock = jest.fn();

  const v4Mock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: CommentRepository,
          useValue: {
            createComment: createCommentMock,
          } as Partial<CommentRepository>,
        },
        {
          provide: UsersService,
          useValue: {
            findUserById: findUserByIdMock,
          } as Partial<UsersService>,
        },
        {
          provide: PostsService,
          useValue: {
            findPostById: findPostByIdMock,
          } as Partial<PostsService>,
        },
      ],
    }).compile();
    commentService = module.get<CommentService>(CommentService);
    userService = module.get<UsersService>(UsersService);
    postService = module.get<PostsService>(PostsService);
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  it('should create a comment', async () => {
    const expected = CreateCommentDto.of(
      'fakeContent',
      'fakeUserId',
      'fakePostId',
      null,
    );
    const fakeUser = User.fromPlain({
      id: 'fakeId',
      email: 'fakeEmail',
      nickname: 'fakeNickName',
      password: 'fakePassword',
    });
    const fakePost = Post.fromPlain({
      authorId: 'fakeAuthorId',
      content: 'fakeContent',
      id: 'fakeId',
      title: 'fakeTitle',
    });
    jest.spyOn(userService, 'findUserById').mockResolvedValue(fakeUser);
    jest.spyOn(postService, 'findPostById').mockResolvedValue(fakePost);
    jest
      .spyOn(commentRepository, 'createComment')
      .mockResolvedValue(expected.toEntity());

    const actual = await commentService.createComment(expected);

    expect(actual).toEqual({
      ...expected,
      id: fakeUUID,
    });
  });
});
