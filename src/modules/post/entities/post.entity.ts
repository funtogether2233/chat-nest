import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  content: string;

  @CreateDateColumn({ name: 'created_time' })
  createdTime: Date;

  @Column({ name: 'is_delete', default: 0 })
  isDelete: number;
}
