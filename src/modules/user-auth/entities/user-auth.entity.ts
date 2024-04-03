import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_pwd' })
  userPwd: string;
}
