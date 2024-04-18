import { IsString } from 'class-validator';

export class CreateGroupMemberDto {
  @IsString()
  groupId: string;

  @IsString()
  userId: string;

  @IsString()
  userStatus: string;
}
