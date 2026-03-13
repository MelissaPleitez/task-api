import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecurringTransactionDto } from '../dto/create-recurring-transaction.dto';
import { UpdateRecurringTransactionDto } from '../dto/update-recurring-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RecurringTransaction } from '../entities/recurring-transaction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecurringTransactionsService {
  constructor(
    @InjectRepository(RecurringTransaction)
    private recurringTransactionRepository: Repository<RecurringTransaction>,
  ) {}

  async createRecurringTransaction(createRecurringTransactionDto: CreateRecurringTransactionDto, userId: number) {
    try {
      const recurringTrans = this.recurringTransactionRepository.create({
        description: createRecurringTransactionDto.description,
        type: createRecurringTransactionDto.type,
        amount: createRecurringTransactionDto.amount,
        frequency: createRecurringTransactionDto.frequency,
        startDate: new Date(createRecurringTransactionDto.startDate),
        endDate: createRecurringTransactionDto.endDate ? new Date(createRecurringTransactionDto.endDate) : null,
        nextDueDate: new Date(createRecurringTransactionDto.startDate),
        isActive: true,
        user: { id: userId },
        category: createRecurringTransactionDto.categoryId ? { id: createRecurringTransactionDto.categoryId } : null,
        account: createRecurringTransactionDto.accountId ? { id: createRecurringTransactionDto.accountId } : null,
      });

      return await this.recurringTransactionRepository.save(recurringTrans);
    } catch {
      throw new BadRequestException('Error creating recurring transaction');
    }
  }

  async findAllRecurringTransaction(userId: number) {
    try {
      const recurringsTrans = await this.recurringTransactionRepository.find({
        where: { user: { id: userId } },
        relations: ['category', 'account'],
        order: { createdAt: 'DESC' },
      });
      return recurringsTrans;
    } catch {
      throw new BadRequestException('Error fetching recurring transaction');
    }
  }

  findOneRecurringTransaction(id: number, userId: number) {
    return this.getOneRecurringTransaction(id, userId);
  }

  async updateRecurringTransaction(id: number, updateRecurringTransactionDto: UpdateRecurringTransactionDto, userId: number) {
    const oldRecurring = await this.getOneRecurringTransaction(id, userId);
    try {
      const mergeRecurring = this.recurringTransactionRepository.merge(oldRecurring, updateRecurringTransactionDto);
      return await this.recurringTransactionRepository.save(mergeRecurring);
    } catch {
      throw new BadRequestException('Error updating Recurring transaction');
    }
  }

  async removeRecurringTransaction(id: number, userId: number) {
    await this.getOneRecurringTransaction(id, userId);
    try {
      await this.recurringTransactionRepository.delete(id);
      return { message: `Recurring transaction with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting Recurring transaction');
    }
  }

  async getOneRecurringTransaction(id: number, userId: number) {
    const recurring = await this.recurringTransactionRepository.findOne({
      where: { id: id, user: { id: userId } },
    });
    if (!recurring) {
      throw new NotFoundException('Recurring transaction not found');
    }
    return recurring;
  }
}
