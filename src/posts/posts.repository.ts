import { Injectable } from '@nestjs/common';
import { DBService } from '../database/db.service';

@Injectable()
export class PostsRepository {
  constructor(private conn: DBService) {}

  async getPostById(postId: string) {
    const sql = `SELECT * FROM posts WHERE postId = ?`;
    const result = await this.conn.query(sql, [postId]);
    return result[0];
  }
}
