import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUserByEmail: jest.fn(),
            createUser: jest.fn().mockResolvedValue(true),
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
    const email = 'test@gmail.com';
    const password = 'password';
    const salt: any = 'salt';
    const hashed = 'hashed';

    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(salt as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashed as never);

    const result = await usersService.createUser(email, password);

    expect(result).toBe(true);
    expect(bcrypt.genSalt).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(usersRepository.createUser).toHaveBeenCalledWith(email, hashed);
  });

  it.todo('완전한 isolation으로 테스트를 진행해보자');
});
