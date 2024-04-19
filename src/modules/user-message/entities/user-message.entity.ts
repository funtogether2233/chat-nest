import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'user_message' })
export class UserMessage {
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
