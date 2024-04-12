import { PartialType } from '@nestjs/mapped-types';
import { CreateRelationMessageDto } from './create-relation-message.dto';

export class UpdateRelationMessageDto extends PartialType(CreateRelationMessageDto) {}
