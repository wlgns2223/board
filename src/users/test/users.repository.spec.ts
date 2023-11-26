import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { DBService } from '../../database/db.service';
import { CreateUserDto } from '../dto/create.dto';

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

  it('should create a user', async () => {
    const fakeCreateUserDto: CreateUserDto = {
      email: 'test@gmail.com',
      password: 'password',
      nickname: 'nickname',
    };

    const queryMock = jest.fn().mockResolvedValue([fakeCreateUserDto]);
    jest.spyOn(usersRepository['conn'], 'query').mockImplementation(queryMock);

    const result = await usersRepository.createUser(fakeCreateUserDto);

    const values =
      '(' +
      Object.values(fakeCreateUserDto)
        .map((value) => '?')
        .join(',') +
      ')';
    expect(queryMock).toHaveBeenCalledWith(
      `INSERT INTO users VALUES ${values}`,
      [...Object.values(fakeCreateUserDto)],
    );
    expect(result).toEqual(fakeCreateUserDto);
  });

  it('should update a user', async () => {
    const email = 'test@gmail.com';
    const toUpdate = {
      nickname: 'newNickname',
    };

    const expected = {
      email,
      ...toUpdate,
    };
    query.mockResolvedValue([expected]);
    jest.spyOn(usersRepository, 'getUserByEmail').mockResolvedValue(expected);
    const result = await usersRepository.updateUser(email, toUpdate);

    const update = Object.keys(toUpdate)
      .map((key) => `${key} = ?`)
      .join(', ');
    const values = Object.values(toUpdate);
    expect(query).toHaveBeenCalledWith(
      `UPDATE users SET ${update} WHERE email = ${email}`,
      [...values, email],
    );
    expect(result).toEqual(expected);
  });
});
