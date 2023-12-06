import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { CreatePostDto } from './dto/createPost.dto';
import { Post } from './posts.model';
import { v4 as uuid } from 'uuid';
import { UpdatePostDto } from './dto/updatePost.dto';

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
      result = await this.db.getLastInsertedRow(refetchSql);
    } catch (error) {
      this.logger.error(error);
    } finally {
      return result;
    }
  }

  async getPostById(postId: string) {
    const sql = `SELECT P.id AS postId, title, content, P.createdAt, P.updatedAt, U.id AS userId, email, nickname  
    FROM posts AS P JOIN users AS U ON P.author_id = U.id WHERE P.id = "${postId}"`;
    const result = await this.db.query(sql, [postId]);
    return Array.isArray(result) ? result[0] : result;
  }

  async updatePostById(postId: string, attrs: UpdatePostDto) {
    let result: Post | undefined = undefined;
    try {
      const update = this.db.helpUpdate(attrs);

      const sql = `UPDATE posts SET ${update} WHERE id = "${postId}"`;

      await this.db.query(sql, [postId]);

      result = await this.getPostById(postId);
    } catch (error) {
      this.logger.error(error);
    } finally {
      return result;
    }
  }

  async deletePostById(postId: string) {
    const sql = `DELETE FROM posts WHERE id = "${postId}"`;
    let result = false;
    try {
      await this.db.query(sql, [postId]);
      result = true;
    } catch (error) {
      this.logger.error(error);
    } finally {
      return result;
    }
  }
}
