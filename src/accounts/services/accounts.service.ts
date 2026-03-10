import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

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

  findAllAccount(userId: number) {
    try {
      const acounts = this.accountsRepository.find({
        where: { user: { id: userId } },
        relations: ['user.profile'],
      });
      return acounts;
    } catch {
      throw new BadRequestException('Error fetching accounts');
    }
  }

  async findOneAccount(id: number, userId: number) {
    const where = userId ? { id: id, user: { id: userId } } : { id: id };
    const account = await this.accountsRepository.findOne({ where });
    if (!account) {
      throw new NotFoundException(`Account with id ${id} not found`);
    }
    return account;
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

  //TRANSACTION
  // async createTransaction(dto: CreateTransactionDto, userId: number) {
  //   try {
  //     // Find the account associated with the transaction
  //     const account = await this.accountsRepository.findOne({
  //       where: { id: dto.accountId, user: { id: userId } },
  //     });
  //     if (!account) {
  //       throw new NotFoundException(`Account with id ${dto.accountId} not found for user ${userId}`);
  //     }

  //     // Create a new transaction
  //     const transaction = this.transactionRepository.create({
  //       amount: dto.amount,
  //       type: dto.type,
  //       description: dto.description,
  //       category: dto.category,
  //       date: new Date(dto.date),
  //       account: account,
  //     });

  //     // Save the transaction to the database
  //     const savedTransaction = await this.transactionRepository.save(transaction);
  //     return savedTransaction;
  //   } catch (error) {
  //     console.log(error);
  //     throw new BadRequestException('Error creating account and transaction');
  //   }
  // }

  // async getTransactionsByMonth(accountId: string, month: string) {
  //   try {
  //     const [year, monthNumber] = month.split('-').map(Number);
  //     const startDate = new Date(year, monthNumber - 1, 1);
  //     const endDate = new Date(year, monthNumber, 0, 23, 59, 59);

  //     return this.transactionRepository.find({
  //       where: {
  //         account: { id: Number(accountId) },
  //         date: Between(startDate, endDate),
  //       },
  //       order: {
  //         date: 'ASC',
  //       },
  //     });
  //   } catch (error) {
  //     console.log('error: ', error);
  //     throw new BadRequestException('Error getting transaction by date');
  //   }
  // }

  // async totalTransactionByAccount(accountId: string) {
  //   try {
  //     const transactions = await this.transactionRepository.findBy({
  //       account: { id: Number(accountId) },
  //     });
  //     const transactionTotal = transactions.reduce((total, transaction) => total + Number(transaction.amount), 0);
  //     return { total: transactionTotal };
  //   } catch {
  //     throw new BadRequestException('Error getting total transaction by account');
  //   }
  // }
}
