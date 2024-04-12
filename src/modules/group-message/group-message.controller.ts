import { Controller } from '@nestjs/common';
import { GroupMessageService } from './group-message.service';

@Controller('group-message')
export class GroupMessageController {
  constructor(private readonly groupMessageService: GroupMessageService) {}
}
