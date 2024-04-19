import { IsString } from 'class-validator';

export class CreateGroupMessageDto {
  @IsString()
  readonly fromId: string;

  @IsString()
  readonly toId: string;

  @IsString()
  readonly msg: string;
}
