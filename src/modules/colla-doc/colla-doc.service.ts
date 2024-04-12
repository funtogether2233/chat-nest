import { Injectable } from '@nestjs/common';
import { CreateCollaDocDto } from './dto/create-colla-doc.dto';
import { UpdateCollaDocDto } from './dto/update-colla-doc.dto';

@Injectable()
export class CollaDocService {
  create(createCollaDocDto: CreateCollaDocDto) {
    return 'This action adds a new collaDoc';
  }

  findAll() {
    return `This action returns all collaDoc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} collaDoc`;
  }

  update(id: number, updateCollaDocDto: UpdateCollaDocDto) {
    return `This action updates a #${id} collaDoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} collaDoc`;
  }
}
