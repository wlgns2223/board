import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { TokenService } from '../token.service';

const getUserByEmail = jest.fn();
const signToken = jest.fn();

describe('auth service', () => {
  let authService: AuthService;
  let userService: UsersService;
  let tokenService: TokenService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserByEmail,
          },
        },
        {
          provide: TokenService,
          useValue: {
            signToken,
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(userService).toBeDefined();
    expect(tokenService).toBeDefined();
  });

  it('should return access token and refresh token', async () => {
    const fakeUser = {
      comparePassword: jest.fn(),
    };
    fakeUser.comparePassword.mockReturnValue(true);
    getUserByEmail.mockResolvedValue(fakeUser);
    const fakeEmail = 'email';
    const fakePassword = 'password';
    const fakeTokens = {
      accessToken: 'fakeAccessToken',
      refreshToken: 'fakeRefreshToken',
    };
    signToken.mockResolvedValue(fakeTokens);

    const result = await authService.signIn(fakeEmail, fakePassword);

    expect(result).toEqual(fakeTokens);
    expect(getUserByEmail).toHaveBeenCalledWith(fakeEmail);
    expect(fakeUser.comparePassword).toHaveBeenCalledWith(fakePassword);
    expect(signToken).toHaveBeenCalledWith({
      sub: fakeEmail,
    });
  });

  it('should throw an error when password does not match', async () => {
    const fakeUser = {
      comparePassword: jest.fn(),
    };
    fakeUser.comparePassword.mockResolvedValue(false);
    getUserByEmail.mockResolvedValue(fakeUser);
    const fakeEmail = 'email';
    const fakePassword = 'password';

    await expect(
      authService.signIn(fakeEmail, fakePassword),
    ).rejects.toThrowError('Password is not matched');

    expect(getUserByEmail).toHaveBeenCalledWith(fakeEmail);
    expect(fakeUser.comparePassword).toHaveBeenCalledWith(fakePassword);
  });
});
