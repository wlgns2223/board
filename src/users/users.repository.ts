import { Injectable } from '@nestjs/common';
import { DBService } from '../database/db.service';

@Injectable()
export class UsersRepository {
  constructor(private conn: DBService) {}

  async getUserByEmail(email: string) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await this.conn.query(sql, [email]);
    return result;
  }
}
