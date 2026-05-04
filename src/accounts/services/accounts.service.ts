import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { TransactionType } from 'src/transactions/enums/transaction-type.enum';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  private async calculateBalance(accountId: number): Promise<number> {
    const result = await this.transactionRepository
      .createQueryBuilder('t')
      .select(
        `
        COALESCE(SUM(CASE WHEN t.type = :income THEN t.amount ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN t.type = :expense THEN t.amount ELSE 0 END), 0)
      `,
        'balance',
      )
      .where('t.account_id = :accountId', { accountId })
      .setParameters({
        income: TransactionType.INCOME,
        expense: TransactionType.EXPENSE,
      })
      .getRawOne<{ balance: number }>();

    return Math.round(Number(result?.balance ?? 0) * 100) / 100;
  }

  async createAccount(createAccountDto: CreateAccountDto, userId: number) {
    try {
      const account = this.accountsRepository.create({
        name: createAccountDto.name,
        accountType: createAccountDto.accountType,
        user: { id: userId },
      });
      const savedAccount = await this.accountsRepository.save(account);
      return this.findOneAccount(savedAccount.id, userId);
    } catch {
      throw new BadRequestException('Error creating account');
    }
  }

  async findAllAccount(userId: number) {
    try {
      const accounts = await this.accountsRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });

      // calculate balance for all accounts in parallel
      const accountsWithBalance = await Promise.all(
        accounts.map(async (account) => ({
          ...account,
          balance: await this.calculateBalance(account.id),
        })),
      );
      return accountsWithBalance;
    } catch {
      throw new BadRequestException('Error fetching accounts');
    }
  }

  async findOneAccount(id: number, userId: number) {
    const account = await this.accountsRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!account) throw new NotFoundException(`Account with id ${id} not found`);

    const balance = await this.calculateBalance(id);
    return { ...account, balance };
  }

  async updateAccount(id: string, updateAccountDto: UpdateAccountDto, userId: number) {
    const account = await this.accountsRepository.findOne({ where: { id: parseInt(id), user: { id: userId } } });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    try {
      const updatedAccount = this.accountsRepository.merge(account, updateAccountDto);
      return await this.accountsRepository.save(updatedAccount);
    } catch {
      throw new BadRequestException('Error updating account');
    }
  }

  async removeAccount(id: string, userId: number) {
    const account = await this.accountsRepository.findOne({
      where: { id: parseInt(id), user: { id: userId } },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }
    try {
      await this.accountsRepository.delete(id);
      return {
        message: `Account with id ${id} was deleted`,
      };
    } catch {
      throw new BadRequestException('Error deleting financial account');
    }
  }
}
