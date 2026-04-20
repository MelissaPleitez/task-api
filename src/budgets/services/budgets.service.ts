import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBudgetDto } from '../dto/update-budget.dto';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionType } from '../../transactions/enums/transaction-type.enum';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  // ── calculates how much has been spent for a given budget ──
  // filters by: date range, expense type, and optionally category + account
  private async calculateSpent(budget: Budget): Promise<number> {
    const qb = this.transactionRepository.createQueryBuilder('t').innerJoin('t.account', 'account').innerJoin('account.user', 'user').where('user.id = :userId', { userId: budget.user.id }).andWhere('t.type = :type', { type: TransactionType.EXPENSE }).andWhere('t.date >= :start', { start: budget.startDate }).andWhere('t.date <= :end', { end: budget.endDate });

    if (budget.category) {
      qb.andWhere('t.category_id = :categoryId', { categoryId: budget.category.id });
    }

    if (budget.account) {
      qb.andWhere('t.account_id = :accountId', { accountId: budget.account.id });
    }

    const result = await qb.select('COALESCE(SUM(t.amount), 0)', 'total').getRawOne<{ total: number }>();

    return Number(result?.total ?? 0);
  }

  async createBudget(createBudgetDto: CreateBudgetDto, userId: number) {
    try {
      const budget = this.budgetRepository.create({
        name: createBudgetDto.name,
        limitAmount: createBudgetDto.limitAmount,
        period: createBudgetDto.period,
        startDate: new Date(createBudgetDto.startDate),
        endDate: new Date(createBudgetDto.endDate),
        alertEnabled: createBudgetDto.alertEnabled ?? false,
        alertThreshPct: createBudgetDto.alertThreshPct ?? 80,
        user: { id: userId },
        category: createBudgetDto.categoryId ? { id: createBudgetDto.categoryId } : null,
        account: createBudgetDto.accountId ? { id: createBudgetDto.accountId } : null,
      });
      const saved = await this.budgetRepository.save(budget);
      return this.getOneBudget(saved.id, userId);
    } catch {
      throw new BadRequestException('Error creating budget');
    }
  }

  async getAllBudget(userId: number) {
    try {
      const budgets = await this.budgetRepository.find({
        where: { user: { id: userId } },
        relations: ['category', 'account', 'user'],
        order: { createdAt: 'DESC' },
      });

      // calculate spentAmount for all budgets in parallel
      const budgetsWithSpent = await Promise.all(
        budgets.map(async (budget) => ({
          ...budget,
          spentAmount: await this.calculateSpent(budget),
        })),
      );

      return budgetsWithSpent;
    } catch {
      throw new BadRequestException('Error getting budgets');
    }
  }

  async getOneBudget(budgetId: number, userId: number) {
    const budget = await this.findOneBudget(budgetId, userId);
    const spentAmount = await this.calculateSpent(budget);
    return { ...budget, spentAmount };
  }

  async updateBudget(budgetId: number, updateBudgetDto: UpdateBudgetDto, userId: number) {
    const budget = await this.findOneBudget(budgetId, userId);
    try {
      const updated = this.budgetRepository.merge(budget, {
        ...updateBudgetDto,
        startDate: updateBudgetDto.startDate ? new Date(updateBudgetDto.startDate) : budget.startDate,
        endDate: updateBudgetDto.endDate ? new Date(updateBudgetDto.endDate) : budget.endDate,
        category: updateBudgetDto.categoryId ? { id: updateBudgetDto.categoryId } : null,
        account: updateBudgetDto.accountId ? { id: updateBudgetDto.accountId } : null,
      });
      const saved = await this.budgetRepository.save(updated);
      return this.getOneBudget(saved.id, userId);
    } catch {
      throw new BadRequestException('Error updating budget');
    }
  }

  async deleteBudget(budgetId: number, userId: number) {
    await this.findOneBudget(budgetId, userId);
    try {
      await this.budgetRepository.delete(budgetId);
      return { message: `Budget with id ${budgetId} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting budget');
    }
  }

  async findOneBudget(budgetId: number, userId: number) {
    const budget = await this.budgetRepository.findOne({
      where: { id: budgetId, user: { id: userId } },
      relations: ['category', 'account', 'user'],
    });
    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }
}
