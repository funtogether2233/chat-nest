import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_name', default: '用户' })
  userName: string;

  @Column({ name: 'user_introduction', default: '介绍一下你自己吧~' })
  userIntroduction: string;
}
