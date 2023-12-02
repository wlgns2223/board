import { Module } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PostsController],
  providers: [PostsRepository, PostsService],
  exports: [],
})
export class PostsModule {}
