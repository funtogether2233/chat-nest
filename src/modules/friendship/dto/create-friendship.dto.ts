import { IsNumber, IsString } from 'class-validator';

export class CreateFriendshipDto {
  @IsString()
  readonly userId: string;

  @IsString()
  readonly friendId: string;

  @IsNumber()
  postPermission: number;
}
