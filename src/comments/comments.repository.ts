import { Injectable, Logger } from '@nestjs/common';
import { DBService } from '../database/db.service';
import { Comment } from './comment.entity';

@Injectable()
export class CommentRepository {
  private logger = new Logger(CommentRepository.name);
  constructor(private conn: DBService) {}

  async getComments(comment: Comment) {}
}

/**
 * Repository layer vs DAO
 *
 * Service layer vs DO
 *
 */
