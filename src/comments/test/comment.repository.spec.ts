import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepository } from '../comments.repository';
import { DBService } from '../../database/db.service';
import { CreateCommentDto } from '../dto/createComment.dto';
import { Query } from '@nestjs/common';
import { QueryHelper } from '../../common/utils/queryHelper';
import { classToPlain, instanceToPlain } from 'class-transformer';

describe('CommentRepository', () => {
  const queryMock = jest.fn();
  const helpInsertMock = jest.fn();

  let commentRepository: CommentRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentRepository,
        {
          provide: DBService,
          useValue: {
            query: queryMock,
            helpInsert: helpInsertMock,
          } as Partial<DBService>,
        },
      ],
    }).compile();
    commentRepository = module.get<CommentRepository>(CommentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentRepository).toBeDefined();
  });

  it('shuold create a comment', async () => {
    const dto = new CreateCommentDto(
      'fakeContent',
      'fakeUserId',
      'fakePostId',
      null,
    ).transform<CreateCommentDto>();

    const queryHelper = new QueryHelper(dto);
    const columns = queryHelper.toColumns();
    const placesholders = queryHelper.toPlaceholders();
    const values = queryHelper.toValues();
    const sql = `INSERT INTO comments ${columns} VALUES ${placesholders}`;
    queryMock.mockResolvedValue(null);
    helpInsertMock.mockReturnValue({ columns, placesholders, values });

    const result = await commentRepository.createComment(dto);

    expect(result).toBe(null);
    expect(queryMock).toHaveBeenCalledWith(sql, values);
  });
});
