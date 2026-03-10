import { Account } from 'src/accounts/entities/account.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BudgetPeriod } from '../enums/budget-period.enum';
import { Category } from 'src/categories/entities/category.entity';

@Entity({ name: 'budgets' })
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  limitAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  spentAmount: number;

  @Column({ type: 'enum', enum: BudgetPeriod })
  period: BudgetPeriod;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @Column({ type: 'boolean', default: false })
  alertEnabled: boolean;

  @Column({ type: 'int', default: 80 })
  alertThreshPct: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category | null;

  @ManyToOne(() => Account, (account) => account.budgets, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'account_id' })
  account: Account | null;
}
