import { PartialType } from '@nestjs/mapped-types';
import { CreatePostMessageDto } from './create-post-message.dto';

export class UpdatePostMessageDto extends PartialType(CreatePostMessageDto) {}
