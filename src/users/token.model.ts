export class RefreshToken {
  id: string;
  userId: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;

  static from(userId: string, refreshToken: string) {
    const token = new RefreshToken();
    token.userId = userId;
    token.refreshToken = refreshToken;
    return token;
  }
}
