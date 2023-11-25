import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { DBService } from '../../database/db.service';

const query = jest.fn();

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: DBService,
          useValue: {
            query,
          },
        },
      ],
    }).compile();
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  const fakeUser = {
    email: 'email@gmail.com',
    password: 'password',
  };

  it('should be defined', () => {
    expect(usersRepository).toBeDefined();
  });

  it('should return user by email', async () => {
    //Arange
    query.mockResolvedValue([fakeUser]);

    //Act
    const result = await usersRepository.getUserByEmail(fakeUser.email);

    //Assert
    expect(result).toEqual(fakeUser);
    expect(query).toHaveBeenCalledWith(`SELECT * FROM users WHERE email = ?`, [
      fakeUser.email,
    ]);
  });

  it('should return user by email', async () => {
    /**
     * AI generated test
     */

    // Arrange
    const email = 'email@gmail.com';
    const fakeUser = {
      email: 'email@gmail.com',
      password: 'password',
    };
    const queryMock = jest.fn().mockResolvedValue([fakeUser]);
    jest.spyOn(usersRepository['conn'], 'query').mockImplementation(queryMock);

    // Act
    const result = await usersRepository.getUserByEmail(email);

    // Assert
    expect(queryMock).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = ?',
      [email],
    );
    expect(result).toEqual(fakeUser);
  });
});
