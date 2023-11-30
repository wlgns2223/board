import { Injectable } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { CreatePostDto } from './dto/createPost.dto';

@Injectable()
export class PostsRepository {
  constructor(private db: DBService) {}

  async createPost(createPostDto: CreatePostDto) {
    const { columns, values, placesholders } =
      this.db.helpInsert(createPostDto);
    const sql = `INSERT INTO posts ${columns} VALUES ${placesholders}`;
    const result = await this.db.query(sql, [...values]);
    return Array.isArray(result) ? result[0] : result;
  }

  async getPostById(postId: string) {
    const sql = `SELECT * FROM posts WHERE postId = ?`;
    const result = await this.db.query(sql, [postId]);
    return Array.isArray(result) ? result[0] : result;
  }
}
