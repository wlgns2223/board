import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './posts.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PostsRepository {
  private logger = new Logger(PostsRepository.name);

  constructor(private db: DBService) {}

  async createPost(createPostDto: CreatePostDto) {
    const id = uuid();
    const { columns, values, placesholders } = this.db.helpInsert({
      ...createPostDto,
      id,
    });
    const sql = `INSERT INTO posts ${columns} VALUES ${placesholders}`;
    const refetchSql = `SELECT P.id AS postId, title, content, P.createdAt, P.updatedAt, U.id AS userId, email, nickname  
    FROM posts AS P JOIN users AS U ON P.author_id = U.id WHERE P.id = "${id}"`;
    let result: Post | undefined = undefined;
    try {
      await this.db.query(sql, values);
      const refetch = await this.db.getLastInsertedRow(refetchSql);
      result = refetch[0];
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
