import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Public()
  @Post('get-user-post-list')
  getUserPostList(@Body() { userId }: { userId: string }) {
    return this.postService.getUserPostList({ userId });
  }

  @Public()
  @Post('get-all-post-list')
  getAllPostList(@Body() { userId }: { userId: string }) {
    return this.postService.getAllPostList({ userId });
  }

  @Public()
  @Post('get-post-detail')
  getPostDetail(@Body() { postId }: { postId: string }) {
    return this.postService.getPostDetail({ postId });
  }

  @Public()
  @Post('create-post')
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
}
