import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './posts.model';

@Injectable()
export class PostsRepository {
  private logger = new Logger(PostsRepository.name);

  constructor(private db: DBService) {}

  async createPost(createPostDto: CreatePostDto) {
    const { columns, values, placesholders } =
      this.db.helpInsert(createPostDto);
    const sql = `INSERT INTO posts ${columns} VALUES ${placesholders}`;
    let result: Post | undefined = undefined;
    try {
      await this.db.query(sql, values);
      result = await this.db.getLastInsertedRow('posts');
    } catch (error) {
      this.logger.error(error);
    } finally {
      return result;
    }
  }

  async getPostById(postId: string) {
    const sql = `SELECT * FROM posts WHERE id = ? JOIN users ON posts.authorId = users.id`;
    const result = await this.db.query(sql, [postId]);
    return Array.isArray(result) ? result[0] : result;
  }
}
