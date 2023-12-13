import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create.dto';
import { User } from '../user.model';

const getUserByEmailMock = jest.fn();
const createUserMock = jest.fn();
const updateUserMock = jest.fn();
const getUserByIdMock = jest.fn();
const deleteUserByEmailMock = jest.fn();

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
            updateUser: updateUserMock,
            getUserById: getUserByIdMock,
            deleteUserByEmail: deleteUserByEmailMock,
          } as Partial<UsersRepository>,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
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

    expect(result).toEqual(expected);
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

  it('should update a user', async () => {
    const expected = {
      ...fakeUserCreateDto,
      nickname: 'newNickname',
    };
    updateUserMock.mockResolvedValue(expected);

    const result = await usersService.updateUser(
      fakeUserCreateDto.email,
      expected,
    );

    expect(result).toEqual(expected);
    expect(updateUserMock).toHaveBeenCalledWith(
      fakeUserCreateDto.email,
      expected,
    );
  });

  it("should throw an error when user doesn't exist", async () => {
    getUserByEmailMock.mockResolvedValue(undefined);
    const expected = {
      ...fakeUserCreateDto,
      nickname: 'newNickname',
    };

    await expect(
      usersService.updateUser(fakeUserCreateDto.email, expected),
    ).rejects.toThrow(BadRequestException);
    await expect(
      usersService.updateUser(fakeUserCreateDto.email, expected),
    ).rejects.toThrow('User does not exist');
  });

  it('should get a user by id ', async () => {
    const id = '1234';
    const user = User.fromPlain({
      id,
    });
    getUserByIdMock.mockResolvedValue(user);

    const result = await usersService.getUserById(id);

    expect(result).toEqual(user);
    expect(getUserByIdMock).toHaveBeenCalledWith(id);
  });

  it('should delete a user by email', async () => {
    const email = 'test@gmail.com';
    const user = User.fromPlain({
      email,
    });
    getUserByEmailMock.mockResolvedValue(user);
    deleteUserByEmailMock.mockResolvedValue(true);

    const result = await usersService.deleteUserByEmail(email);

    expect(result).toEqual(true);
    expect(getUserByEmailMock).toHaveBeenCalledWith(email);
    expect(deleteUserByEmailMock).toHaveBeenCalledWith(email);
  });

  it("should throw an error when user doesn't exist on delete", async () => {
    const email = 'test@gmail';
    getUserByEmailMock.mockResolvedValue(undefined);

    await expect(usersService.deleteUserByEmail(email)).rejects.toThrow(
      BadRequestException,
    );
    await expect(usersService.deleteUserByEmail(email)).rejects.toThrow(
      'User does not exist',
    );
  });

  it("should throw an error when repository layer can't delete a user", async () => {
    const email = 'test@gmail.com';
    const user = User.fromPlain({
      email,
    });
    getUserByEmailMock.mockResolvedValue(user);
    deleteUserByEmailMock.mockRejectedValue(new Error("Can't delete user"));

    await expect(usersService.deleteUserByEmail(email)).rejects.toThrow(
      new Error("Can't delete user"),
    );
  });
});
