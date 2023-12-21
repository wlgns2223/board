import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { CommentEntity } from './comment.entity';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private userService: UsersService,
    private postService: PostsService,
  ) {}

  async createComment(comment: CommentEntity) {
    const userFound = await this.userService.findUserById(comment.userId);
    if (!userFound) {
      throw new BadRequestException('User Not Found');
    }

    const postFound = await this.postService.findPostById(comment.postId);
    if (!postFound) {
      throw new BadRequestException('Post Not Found');
    }

    return await this.commentRepository.createComment(comment);
  }
}
