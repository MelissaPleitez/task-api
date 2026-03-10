import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionType } from '../enums/transaction-type.enum';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateTransactionDto, userId: number) {
    // 1. Verify account belongs to user
    const account = await this.accountRepository.findOne({
      where: { id: dto.accountId, user: { id: userId } },
    });
    if (!account) {
      throw new NotFoundException(`Account ${dto.accountId} not found for this user`);
    }

    // 2. Load category if provided
    let category: Category | null = null;
    if (dto.categoryId) {
      category = await this.categoryRepository.findOne({
        where: [
          { id: dto.categoryId, user: { id: userId } },
          { id: dto.categoryId, isSystem: true },
        ],
      });
      if (!category) {
        throw new NotFoundException(`Category ${dto.categoryId} not found`);
      }
    }

    // 3. Create and save
    const transaction = this.transactionRepository.create({
      amount: dto.amount,
      type: dto.type,
      description: dto.description ?? null,
      date: new Date(dto.date),
      account,
      category,
      isRecurring: false,
    });

    return this.transactionRepository.save(transaction);
  }

  async findAllByAccount(accountId: number, userId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    return this.transactionRepository.find({
      where: { account: { id: accountId } },
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findByMonth(accountId: number, month: string, userId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59);

    return this.transactionRepository.find({
      where: {
        account: { id: accountId },
        date: Between(startDate, endDate),
      },
      relations: ['category'],
      order: { date: 'ASC' },
    });
  }

  async totalByAccount(accountId: number, userId: number) {
    const account = await this.accountRepository.findOne({
      where: { id: accountId, user: { id: userId } },
    });
    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    const transactions = await this.transactionRepository.findBy({
      account: { id: accountId },
    });

    const totalIncome = transactions.filter((tx) => tx.type === TransactionType.INCOME).reduce((sum, tx) => sum + Number(tx.amount), 0);

    const totalExpenses = transactions.filter((tx) => tx.type === TransactionType.EXPENSE).reduce((sum, tx) => sum + Number(tx.amount), 0);

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }

  async update(id: number, dto: UpdateTransactionDto, userId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account', 'account.user'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    if (transaction.account.user?.id !== userId) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    const updated = this.transactionRepository.merge(transaction, dto);
    return this.transactionRepository.save(updated);
  }

  async remove(id: number, userId: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['account', 'account.user'],
    });
    if (!transaction || transaction.account.user?.id !== userId) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    await this.transactionRepository.delete(id);
    return { message: `Transaction ${id} deleted` };
  }
}
