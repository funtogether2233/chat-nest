import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { UserMessageService } from './user-message.service';

@Controller('user-message')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}

  @Public()
  @Post('get-user-message')
  getUserMessage(@Body() { fromId, toId }: { fromId: string; toId: string }) {
    return this.userMessageService.getUserMessage({ fromId, toId });
  }
}
