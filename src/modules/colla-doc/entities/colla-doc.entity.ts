import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CollaDoc {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'doc_name', default: '默认文档' })
  docName: string;

  @Column({ name: 'doc_introduction', default: '介绍一下文档吧~' })
  docIntroduction: string;

  @Column({ name: 'is_delete', default: 0 })
  isDelete: number;
}
