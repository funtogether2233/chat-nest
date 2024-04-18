import { IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  readonly groupId: string;

  @IsString()
  readonly groupName: string;
}
