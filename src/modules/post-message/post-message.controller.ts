import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { CreatePostMessageDto } from './dto/create-post-message.dto';
import { PostMessageService } from './post-message.service';

@Controller('post-message')
export class PostMessageController {
  constructor(private readonly postMessageService: PostMessageService) {}

  @Public()
  @Post('create-post-message')
  createPostMessage(@Body() createPostMessageDto: CreatePostMessageDto) {
    return this.postMessageService.createPostMessage(createPostMessageDto);
  }
}
