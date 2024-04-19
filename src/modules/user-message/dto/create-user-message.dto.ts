import { IsString } from 'class-validator';

export class CreateUserMessageDto {
  @IsString()
  readonly fromId: string;

  @IsString()
  readonly toId: string;

  @IsString()
  readonly msg: string;
}
