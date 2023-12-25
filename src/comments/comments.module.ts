import { Module } from '@nestjs/common';
import { CommentController } from './comments.controller';
import { CommentService } from './comments.service';
import { CommentRepository } from './comments.repository';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [UsersModule, PostsModule],
  providers: [CommentService, CommentRepository],
  controllers: [CommentController],
})
export class CommentsModule {}
