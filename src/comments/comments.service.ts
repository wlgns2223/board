import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepository } from './comments.repository';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private userService: UsersService,
    private postService: PostsService,
  ) {}

  async createComment(comment: CreateCommentDto) {
    const userFound = await this.userService.findUserById(comment.userId);
    if (!userFound) {
      throw new BadRequestException('User Not Found');
    }

    const postFound = await this.postService.findPostById(comment.postId);
    if (!postFound) {
      throw new BadRequestException('Post Not Found');
    }
    const commentEntity = comment.toEntity();

    return await this.commentRepository.createComment(commentEntity);
  }
}
