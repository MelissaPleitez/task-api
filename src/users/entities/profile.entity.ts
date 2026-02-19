import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({
  name: 'profiles',
})
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, name: 'last_name' })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, name: 'avatar_pic', nullable: true })
  avatarPic: string;

  @Column({ type: 'varchar', length: 600, name: 'background_pic', nullable: true })
  backgroundPic: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
