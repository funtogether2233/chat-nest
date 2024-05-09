import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'friend_id' })
  friendId: string;

  @Column({ name: 'post_permission', default: 1 })
  postPermission: number;
}
