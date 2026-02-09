import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Repository } from 'typeorm';
import { Transaction as AccountTransaction } from '../entities/transaction.entity';
import { CreateAccountWithTransactionDto } from '../dto/create-account-with-transaction.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(AccountTransaction)
    private transactionRepository: Repository<AccountTransaction>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      const account = await this.accountsRepository.save({
        name: createAccountDto.name,
        type: createAccountDto.accountType,
        user: { id: createAccountDto.userId },
      });
      return this.findOneAccount(account.id.toString());
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
  async createAccountWithInitialTransaction(dto: CreateAccountWithTransactionDto) {
    try {
      // Creamos la cuenta con la relación User correcta
      const account = this.accountsRepository.create({
        name: dto.name,
        accountType: dto.accountType,
        user: { id: dto.userId },
      });
      console.log('account to be saved:', account);
      // Guardamos la cuenta
      const savedAccount = await this.accountsRepository.save(account);
      console.log('savedAccounts:', savedAccount);
      console.log('el dto mas initialTransaction:', dto.initialTransaction);

      if (dto.initialTransaction) {
        const transaction = this.transactionRepository.create({
          ...dto.initialTransaction,
          account: savedAccount,
        });
        console.log('Transaction to be saved:', transaction);
        await this.transactionRepository.save(transaction);
      }

      return this.findOneAccount(savedAccount.id.toString());
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error creating account and transaction');
    }
  }

  // async findAllTransaction() {
  //   try {
  //     const transactions = await this.transactionsRepository.find({
  //       relations: ['user.profile', 'account'],
  //     });
  //     return transactions;
  //   } catch {
  //     throw new BadRequestException('Error fetching transactions');
  //   }
  // }

  // async findOneTransaction(id: string) {
  //   try {
  //     const transaction = await this.transactionsRepository.findOne({
  //       where: { id: parseInt(id) },
  //       relations: ['user.profile', 'account'],
  //     });
  //     if (!transaction) {
  //       throw new NotFoundException(`Transaction with id ${id} not found `);
  //     }
  //     return transaction;
  //   } catch {
  //     throw new BadRequestException('Error fetching transaction');
  //   }
  // }

  // async createTransaction(createTransactionDto: CreateTransactionDto) {
  //   try {
  //     const saveTransaction = await this.transactionsRepository.save({
  //       ...createTransactionDto,
  //       account: { id: createTransactionDto.accountId },
  //     });
  //     return this.findOneTransaction(saveTransaction.id.toString());
  //   } catch {
  //     throw new BadRequestException('Error creating transaction');
  //   }
  // }

  // async updateTransaction(id: string, updateTransactionDto: UpdateTransactionDto) {
  //   try {
  //     const transaction = await this.transactionsRepository.findOneBy({ id: parseInt(id) });

  //     if (!transaction) {
  //       throw new NotFoundException(`Transaction with id ${id} not found `);
  //     }
  //     const updatedTransaction = this.transactionsRepository.merge(transaction, updateTransactionDto);
  //     const savedTransaction = await this.transactionsRepository.save(updatedTransaction);
  //     return savedTransaction;
  //   } catch {
  //     throw new BadRequestException('Error updating transaction');
  //   }
  // }

  // async removeTransaction(id: string) {
  //   await this.transactionsRepository.delete(parseInt(id));
  //   return { message: `Transaction with id ${id} has been deleted` };
  // }
}
