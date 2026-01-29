import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateDateColumn } from 'typeorm/browser';

@Entity({
  name: 'tasks',
})
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, name: 'cover_pic', nullable: true })
  coverPic: string;

  @Column({ type: 'varchar', default: false })
  status: string; //(pending | in_progress | done)

  @Column({ type: 'varchar' })
  priority: string; //(low | medium | high)

  @Column({ type: 'varchar', length: 100 })
  category: string; //(work | personal | gym | finance | study)

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}
