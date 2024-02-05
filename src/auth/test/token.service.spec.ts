import { Test, TestingModule } from '@nestjs/testing';
import { ITokenPayload, TokenService } from '../token.service';
import { JwtService } from '@nestjs/jwt';

const signAsync = jest.fn();

describe('Token Service', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            signAsync,
          },
        },
      ],
    }).compile();
    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('should return acess token and refresh token', async () => {
    const accessToken = 'fakeAccessToken';
    const refreshToken = 'fakeRefreshToken';
    const payload: ITokenPayload = {
      sub: 'test@gemail.com',
    };
    signAsync.mockResolvedValueOnce(accessToken);
    signAsync.mockResolvedValueOnce(refreshToken);

    const result = await tokenService.signToken(payload);

    expect(result).toEqual({
      accessToken,
      refreshToken,
    });
    expect(signAsync).toHaveBeenCalledTimes(2);
    expect(signAsync).toHaveBeenCalledWith(payload, {
      expiresIn: '1h',
    });
    expect(signAsync).toHaveBeenCalledWith(payload, {
      expiresIn: '1d',
    });
  });
});
