import { IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  readonly groupId: string;

  @IsString()
  readonly groupName: string;

  @IsString()
  readonly groupIntroduction: string;

  @IsString()
  readonly avatarImg: string;

  @IsNumber()
  isDisbanded: number;
}
