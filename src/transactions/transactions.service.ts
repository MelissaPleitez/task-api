import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}
  async createTransaction(createTransactionDto: CreateTransactionDto) {
    try {
      const transaction = this.transactionsRepository.create(createTransactionDto);
      const saveTransaction = await this.transactionsRepository.save(transaction);
      return saveTransaction;
    } catch {
      throw new BadRequestException('Error creating transaction');
    }
  }

  async findAllTransaction() {
    try {
      const transactions = await this.transactionsRepository.find({
        relations: ['user', 'account'],
      });
      return transactions;
    } catch {
      throw new BadRequestException('Error fetching transactions');
    }
  }

  async findOneTransaction(id: string) {
    try {
      const transaction = await this.transactionsRepository.findOneBy({ id: parseInt(id) });
      if (!transaction) {
        throw new NotFoundException(`Transaction with id ${id} not found `);
      }
      return transaction;
    } catch {
      throw new BadRequestException('Error fetching transaction');
    }
  }

  async updateTransaction(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      const transaction = await this.transactionsRepository.findOneBy({ id: parseInt(id) });

      if (!transaction) {
        throw new NotFoundException(`Transaction with id ${id} not found `);
      }
      const updatedTransaction = this.transactionsRepository.merge(transaction, updateTransactionDto);
      const savedTransaction = await this.transactionsRepository.save(updatedTransaction);
      return savedTransaction;
    } catch {
      throw new BadRequestException('Error updating transaction');
    }
  }

  removeTransaction(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
