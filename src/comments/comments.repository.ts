import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { CommentEntity } from './comment.entity';

/**
 * Repository layer vs DAO
 * Service layer vs DO or Entity
 */

@Injectable()
export class CommentRepository {
  private logger = new Logger(CommentRepository.name);
  constructor(private db: DBService) {}

  async findCommentById(id: string): Promise<CommentEntity> {
    const sql = `SELECT 
    C.id, C.content,C.post_id AS postId,C.created_at AS createdAt,C.parent_id AS parentId, U.email FROM comments AS C
    JOIN posts AS P ON C.post_id = P.id
    JOIN users AS U ON C.user_id = U.id
    WHERE C.id = ?
    `;
    try {
      const result = await this.db.query(sql, [id]);
      return result[0];
    } catch (error) {
      this.logger.error(error);
      throw new Error("Can't find a comment");
    }
  }

  async createComment(newComment: CommentEntity) {
    const { columns, placesholders, values } = this.db.helpInsert(newComment);
    const sql = `INSERT INTO comments ${columns} VALUES ${placesholders}`;

    try {
      await this.db.query(sql, values);
      const result = await this.findCommentById(newComment.id);

      return result;
    } catch (error) {
      this.logger.error(error);
      throw new Error("Can't create a comment");
    }
  }
}
