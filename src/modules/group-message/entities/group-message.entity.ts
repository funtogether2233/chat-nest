import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'group_message' })
export class GroupMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'from_id' })
  fromId: string;

  @Column({ name: 'to_id' })
  toId: string;

  @Column()
  msg: string;

  @CreateDateColumn()
  createdTime: Date;
}
