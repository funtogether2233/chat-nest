import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { PostMessageService } from './post-message.service';

@Controller('post-message')
export class PostMessageController {
  constructor(private readonly postMessageService: PostMessageService) {}

  @Public()
  @Post('create-post-message')
  createPostMessage(
    @Body()
    {
      postId,
      userId,
      content
    }: {
      postId: string;
      userId: string;
      content: string;
    }
  ) {
    return this.postMessageService.createPostMessage({
      postId,
      userId,
      content
    });
  }

  @Public()
  @Post('delete-post-message')
  deletePostMessage(@Body() { postMessageId }: { postMessageId: string }) {
    return this.postMessageService.deletePostMessage({ postMessageId });
  }
}
