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

  @Column({
    name: 'avatar_img',
    default: 'https://img2.imgtp.com/2024/04/19/gj74JzoO.jpg'
  })
  avatarImg: string;
}
