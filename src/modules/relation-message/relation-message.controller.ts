import { Controller } from '@nestjs/common';
import { RelationMessageService } from './relation-message.service';

@Controller('relation-message')
export class RelationMessageController {
  constructor(
    private readonly relationMessageService: RelationMessageService
  ) {}
}
