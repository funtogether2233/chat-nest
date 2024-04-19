import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'group_name', default: '群组' })
  groupName: string;

  @Column({ name: 'group_introduction', default: '介绍一下群聊吧~' })
  groupIntroduction: string;

  @Column({
    name: 'avatar_img',
    default: 'https://img2.imgtp.com/2024/04/20/I2HmK2PR.png'
  })
  avatarImg: string;

  @Column({
    name: 'is_disbanded',
    default: 0
  })
  isDisbanded: number;
}
