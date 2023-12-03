import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostsRepository,
    private usersService: UsersService,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const { authorId } = createPostDto;

    const user = await this.usersService.getUserById(authorId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.postRepository.createPost(createPostDto);
  }

  async getPostById(postId: string) {
    return this.postRepository.getPostById(postId);
  }
}
