import { BadRequestException, Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/createPost.dto';
import { UsersService } from '../users/users.service';
import { UpdatePostDto } from './dto/updatePost.dto';

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

    return await this.postRepository.createPost(createPostDto);
  }

  async getPostById(postId: string) {
    return await this.postRepository.getPostById(postId);
  }

  async updatePostById(postId: string, attrs: UpdatePostDto) {
    return await this.postRepository.updatePostById(postId, attrs);
  }

  async deletePostById(postId: string) {
    return await this.postRepository.deletePostById(postId);
  }
}
