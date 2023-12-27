import { Test, TestingModule } from '@nestjs/testing';
import { CommentRepository } from '../comments.repository';
import { DBService } from '../../database/db.service';
import { CreateCommentDto } from '../dto/createComment.dto';
import { QueryHelper } from '../../common/utils/queryHelper';

const fakeUUID = 'fakeUUID';
jest.mock('uuid', () => {
  return {
    v4: () => fakeUUID,
  };
});

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
    const entity = CreateCommentDto.of(
      'fakeContent',
      'fakeUserId',
      'fakePostId',
      null,
    ).toEntity();

    const queryHelper = new QueryHelper(entity);
    const columns = queryHelper.toColumns();
    const placesholders = queryHelper.toPlaceholders();
    const values = queryHelper.toValues();
    const sql = `INSERT INTO comments ${columns} VALUES ${placesholders}`;
    queryMock.mockResolvedValue(entity);
    helpInsertMock.mockReturnValue({ columns, placesholders, values });
    jest.spyOn(commentRepository, 'findCommentById').mockResolvedValue(entity);

    const actual = await commentRepository.createComment(entity);

    expect(actual).toEqual(entity);
    expect(queryMock).toHaveBeenCalledWith(sql, values);
  });

  it('should throw an error on fail to create', async () => {
    const dto = CreateCommentDto.of(
      'fakeContent',
      'fakeUserId',
      'fakePostId',
      null,
    ).toEntity();
    const queryHelper = new QueryHelper(dto);
    const columns = queryHelper.toColumns();
    const placesholders = queryHelper.toPlaceholders();
    const values = queryHelper.toValues();
    const sql = `INSERT INTO comments ${columns} VALUES ${placesholders}`;
    queryMock.mockRejectedValue('error');
    jest
      .spyOn(commentRepository['logger'], 'error')
      .mockImplementation(() => {});

    await expect(commentRepository.createComment(dto)).rejects.toThrow(Error);
  });
});
