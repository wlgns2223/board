import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { DBService } from '../../database/db.service';
import { CreateUserDto } from '../dto/create.dto';
import { UpdateUserDto } from '../dto/update.dto';
import { User } from '../user.model';

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
    const userKeys = Object.keys(User.fromPlain({}))
      .filter((key) => key !== 'password')
      .join(',');
    const sql = `SELECT ${userKeys} FROM users WHERE email = ?`;

    //Act
    const result = await usersRepository.getUserByEmail(fakeUser.email);

    //Assert
    expect(result).toEqual(fakeUser);
    expect(query).toHaveBeenCalledWith(sql, [fakeUser.email]);
  });

  it('should create a user', async () => {
    const fakeCreateUserDto: CreateUserDto = {
      email: 'test@gmail.com',
      password: 'password',
      nickname: 'nickname',
    };

    query.mockResolvedValue([fakeCreateUserDto]);
    const columns = Object.keys(fakeCreateUserDto).join(',');
    const values = Object.values(fakeCreateUserDto)
      .map((value) => '?')
      .join(',');

    const sql = `INSERT INTO users (${columns}) VALUES (${values})`;

    const result = await usersRepository.createUser(fakeCreateUserDto);

    expect(query).toHaveBeenCalledWith(sql, [
      ...Object.values(fakeCreateUserDto),
    ]);
    expect(result).toEqual(fakeCreateUserDto);
  });

  it('should update a user', async () => {
    const updateDto: UpdateUserDto = {
      nickname: 'newNickName',
    };

    const expected = {
      ...fakeUser,
      ...updateDto,
    };

    const columns = Object.entries(updateDto)
      .map(([key, value]) => `${key} = ${value}`)
      .join(', ');
    const sql = `UPDATE users SET ${columns} WHERE email = ${fakeUser.email}`;
    query.mockResolvedValue([expected]);

    const result = await usersRepository.updateUser(fakeUser.email, updateDto);

    expect(query).toHaveBeenCalledWith(sql, [fakeUser.email]);
    expect(result).toEqual(expected);
  });
});
