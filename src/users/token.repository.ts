import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';

@Injectable()
export class TokenRepository {
  private logger = new Logger(TokenRepository.name);
  constructor(private db: DBService) {}

  async storeToken(token: string, userId: string) {
    const { columns, placesholders, values } = this.db.helpInsert<{
      user_id: string;
      refresh_token: string;
    }>({
      refresh_token: token,
      user_id: userId,
    });

    const sql = `INSERT INTO refresh_tokens ${columns} VALUES ${placesholders}`;

    const result = await this.db.query(sql, values);

    return result;
  }

  async getToken(token: string, userId: string) {
    const sql = `SELECT * FROM refresh_tokens WHERE refresh_token = ? AND user_id = ?`;
    const result = await this.db.query(sql, [token, userId]);

    return result;
  }
}
