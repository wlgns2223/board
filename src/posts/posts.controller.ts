import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
  async findPostById(@Param('id') id: string) {
    return await this.postsService.findPostById(id);
  }

  @Get()
  async getPosts(@Query('page') page: number) {
    return await this.postsService.getPosts(page);
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
