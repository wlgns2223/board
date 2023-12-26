import {
  Body,
  CallHandler,
  Controller,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
  Post,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';

@Controller('comments')
export class CommentController {
  private logger = new Logger(CommentController.name);
  constructor(private commentService: CommentService) {}

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.createComment(createCommentDto);
  }
}
