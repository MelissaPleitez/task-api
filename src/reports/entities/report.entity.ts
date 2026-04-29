import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ReportType } from 'src/reports/enums/report-type.enum';

@Entity({ name: 'reports' })
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType;

  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'jsonb', default: {} })
  data: {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
    savingsRate: number;
    byCategory: { categoryId: number; name: string; total: number }[];
    byAccount: { accountId: number; name: string; total: number }[];
    topExpenses: { description: string; amount: number; date: Date }[];
  };

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.reports, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
