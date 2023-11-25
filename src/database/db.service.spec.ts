import { Test, TestingModule } from '@nestjs/testing';
import { DBService } from './db.service';
import { ConfigService } from '@nestjs/config';
import { PoolConnection } from 'mysql2';

describe('database', () => {
  let dbService: DBService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DBService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(''),
          },
        },
      ],
    }).compile();

    dbService = module.get<DBService>(DBService);
  });

  it('should be defined', () => {
    expect(dbService).toBeDefined();
  });

  it('should execute a query', async () => {
    const fakeUsers = [{ id: 1, name: 'John' }];
    const mockConnection: any = {
      query: jest.fn().mockResolvedValue([fakeUsers, []]),
      release: jest.fn(),
    };
    jest
      .spyOn(dbService['pool'], 'getConnection')
      .mockResolvedValue(mockConnection);

    // Call the method being tested
    const result = await dbService.query('SELECT * FROM users');

    // Assert the result
    expect(result).toEqual(fakeUsers); // Replace with your expected query result

    // Verify that the necessary dependencies were called
    expect(mockConnection.query).toHaveBeenCalledWith(
      'SELECT * FROM users',
      undefined,
    );
    expect(mockConnection.release).toHaveBeenCalled();
  });
});
