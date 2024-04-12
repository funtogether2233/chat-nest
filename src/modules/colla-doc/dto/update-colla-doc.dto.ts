import { PartialType } from '@nestjs/mapped-types';
import { CreateCollaDocDto } from './create-colla-doc.dto';

export class UpdateCollaDocDto extends PartialType(CreateCollaDocDto) {
  id: number;
}
