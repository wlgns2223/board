import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.dto';

const getUserByEmailMock = jest.fn();
const createUserMock = jest.fn();

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  const fakeUserCreateDto: CreateUserDto = {
    email: 'test@gmail.com',
    password: 'password',
    nickname: 'nickname',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUserByEmail: getUserByEmailMock,
            createUser: createUserMock,
          },
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should create a user', async () => {
    const salt: any = 'salt';
    const hashed = 'hashed';

    const expected = {
      ...fakeUserCreateDto,
      password: hashed,
    };

    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashed as never);
    createUserMock.mockResolvedValue(expected);

    const result = await usersService.createUser(fakeUserCreateDto);

    expect(result).toBe(expected);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(fakeUserCreateDto.password, salt);
    expect(usersRepository.createUser).toHaveBeenCalledWith(expected);
  });

  it('should throw an error if user already exists', async () => {
    getUserByEmailMock.mockResolvedValue(fakeUserCreateDto);

    await expect(usersService.createUser(fakeUserCreateDto)).rejects.toThrow(
      BadRequestException,
    );

    await expect(usersService.createUser(fakeUserCreateDto)).rejects.toThrow(
      'User already exists',
    );
  });

  it.todo('should update');
});