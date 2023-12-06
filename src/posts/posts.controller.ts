import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return await this.postsService.createPost(createPostDto);
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return await this.postsService.getPostById(id);
  }

  @Put(':id')
  async updatePostById(@Param('id') id: string, @Body() attrs: UpdatePostDto) {
    console.log(attrs);
    return await this.postsService.updatePostById(id, attrs);
  }

  @Delete(':id')
  async deletePostById(@Param('id') id: string) {
    return await this.postsService.deletePostById(id);
  }
}
