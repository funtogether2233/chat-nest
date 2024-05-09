import { IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  userId: string;

  @IsString()
  content: string;

  @IsNumber()
  isDelete: number;
}
