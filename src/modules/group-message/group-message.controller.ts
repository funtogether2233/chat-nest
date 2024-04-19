import { Body, Controller, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { GroupMessageService } from './group-message.service';

@Controller('group-message')
export class GroupMessageController {
  constructor(private readonly groupMessageService: GroupMessageService) {}

  @Public()
  @Post('get-group-message')
  getGroupMessage(@Body() { fromId, toId }: { fromId: string; toId: string }) {
    return this.groupMessageService.getGroupMessage({ fromId, toId });
  }
}
