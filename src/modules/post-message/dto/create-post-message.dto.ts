import { IsString } from 'class-validator';

export class CreatePostMessageDto {
  @IsString()
  postId: string;

  @IsString()
  userId: string;

  @IsString()
  content: string;
}
