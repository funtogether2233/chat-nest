import { Controller } from '@nestjs/common';
import { UserMessageService } from './user-message.service';

@Controller('user-message')
export class UserMessageController {
  constructor(private readonly userMessageService: UserMessageService) {}
}
