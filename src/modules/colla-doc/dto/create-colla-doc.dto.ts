import { IsNumber, IsString } from 'class-validator';

export class CreateCollaDocDto {
  @IsString()
  readonly groupId: string;

  @IsString()
  readonly docName: string;

  @IsString()
  readonly docIntroduction: string;

  @IsNumber()
  isDelete: number;
}
