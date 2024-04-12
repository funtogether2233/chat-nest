import { Module } from '@nestjs/common';
import { CollaDocGateway } from './colla-doc.gateway';
import { CollaDocService } from './colla-doc.service';

@Module({
  providers: [CollaDocGateway, CollaDocService]
})
export class CollaDocModule {}
