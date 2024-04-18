import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_status', default: '0' })
  userStatus: string;
}
