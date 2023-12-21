import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from '../comments.service';
import { CommentRepository } from '../comments.repository';
import { UsersService } from '../../users/users.service';
import { PostsService } from '../../posts/posts.service';

/**
 * Mocking 함수말고
 * Jest.Spyon을 사용해보자
 * 그리고 그에 대해 이번기회에 좀 더 자세히 학습해보자...
 */

describe('Comment Service', () => {
  let commentService: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        // {
        //   provide: CommentRepository,
        //   useValue: {} as Partial<CommentRepository>,
        // },
        // {
        //   provide: UsersService,
        //   useValue: {} as Partial<UsersService>,
        // },
        // {
        //   provide: PostsService,
        //   useValue: {} as Partial<PostsService>,
        // },
      ],
    }).compile();
    commentService = module.get<CommentService>(CommentService);
  });
});
