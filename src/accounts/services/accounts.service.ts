import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Between, Repository } from 'typeorm';
import { Transaction as AccountTransaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
// import { CreateAccountWithTransactionDto } from '../dto/create-account-with-transaction.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(AccountTransaction)
    private transactionRepository: Repository<AccountTransaction>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto, userId: number) {
    try {
      const account = this.accountsRepository.create({
        name: createAccountDto.name,
        accountType: createAccountDto.accountType,
        user: { id: userId },
        transactions: createAccountDto.transactions,
      });
      const savedAccount = await this.accountsRepository.save(account);
      console.log('account to be saved:', savedAccount);
      return this.findOneAccount(savedAccount.id.toString());
    } catch {
      throw new BadRequestException('Error creating account');
    }
  }

  findAllAccount() {
    try {
      const acounts = this.accountsRepository.find({
        relations: ['user.profile', 'transactions'],
      });
      return acounts;
    } catch {
      throw new BadRequestException('Error fetching accounts');
    }
  }

  async findOneAccount(id: string) {
    const account = await this.accountsRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['transactions'],
    });
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return account;
  }

  async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountsRepository.findOneBy({ id: parseInt(id) });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    try {
      const updatedAccount = this.accountsRepository.merge(account, updateAccountDto);
      const savedAccount = await this.accountsRepository.save(updatedAccount);
      return savedAccount;
    } catch {
      throw new BadRequestException('Error updating account');
    }
  }

  async removeAccount(id: string) {
    try {
      await this.accountsRepository.delete(id);
      return {
        error: `Account with id ${id} was deleted`,
      };
    } catch {
      throw new BadRequestException('Error deleting finalcial account');
    }
  }

  //TRANSACTION
  async createTransaction(dto: CreateTransactionDto, userId: number) {
    try {
      // Find the account associated with the transaction
      const account = await this.accountsRepository.findOne({
        where: { id: dto.accountId, user: { id: userId } },
      });
      if (!account) {
        throw new NotFoundException(`Account with id ${dto.accountId} not found for user ${userId}`);
      }

      // Create a new transaction
      const transaction = this.transactionRepository.create({
        amount: dto.amount,
        type: dto.type,
        description: dto.description,
        category: dto.category,
        date: new Date(dto.date),
        account: account,
      });

      // Save the transaction to the database
      const savedTransaction = await this.transactionRepository.save(transaction);
      return savedTransaction;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating account and transaction');
    }
  }

  async getTransactionsByMonth(accountId: string, month: string) {
    try {
      const [year, monthNumber] = month.split('-').map(Number);
      const startDate = new Date(year, monthNumber - 1, 1);
      const endDate = new Date(year, monthNumber, 0, 23, 59, 59);

      return this.transactionRepository.find({
        where: {
          account: { id: Number(accountId) },
          date: Between(startDate, endDate),
        },
        order: {
          date: 'ASC',
        },
      });
    } catch (error) {
      console.log('error: ', error);
      throw new BadRequestException('Error getting transaction by date');
    }
  }
}
