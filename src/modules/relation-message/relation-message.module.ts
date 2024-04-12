import { Module } from '@nestjs/common';
import { RelationMessageService } from './relation-message.service';
import { RelationMessageController } from './relation-message.controller';

@Module({
  controllers: [RelationMessageController],
  providers: [RelationMessageService],
})
export class RelationMessageModule {}
