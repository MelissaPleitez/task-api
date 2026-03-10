import { User } from '../../users/entities/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Transaction as AccountTransaction } from '../../transactions/entities/transaction.entity';
import { AccountType } from '../enums/account-type.enum';
import { Budget } from 'src/budgets/entities/budget.entity';
import { RecurringTransaction } from 'src/recurring-transactions/entities/recurring-transaction.entity';

@Entity({
  name: 'accounts',
})
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => AccountTransaction, (transaction) => transaction.account, { cascade: true })
  transactions: AccountTransaction[];

  @OneToMany(() => Budget, (budget) => budget.account)
  budgets: Budget[];

  @OneToMany(() => RecurringTransaction, (recurring) => recurring.account)
  recurringTransactions: RecurringTransaction[];
}
