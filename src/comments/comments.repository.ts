import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentRepository {
  private logger = new Logger(CommentRepository.name);
  constructor(private db: DBService) {}

  async createComment(dto: CreateCommentDto) {
    const { columns, placesholders, values } = this.db.helpInsert(dto);
    const sql = `INSERT INTO comments ${columns} VALUES ${placesholders}`;

    try {
      const result = await this.db.query(sql, values);
      console.log({ result });
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new Error("Can't create a comment");
    }
  }
}

/**
 * Repository layer vs DAO
 * Service layer vs DO or Entity
 */
