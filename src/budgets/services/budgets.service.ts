import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBudgetDto } from '../dto/create-budget.dto';
import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBudgetDto } from '../dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(@InjectRepository(Budget) private budgetRepository: Repository<Budget>) {}

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
      return this.budgetRepository.findOne({
        where: { id: saved.id },
        relations: ['user', 'category', 'account'],
      });
    } catch {
      throw new BadRequestException('Error creating budget');
    }
  }

  async getAllBudget(userId: number) {
    try {
      const budgests = await this.budgetRepository.find({
        where: { user: { id: userId } },
        relations: ['category', 'account'],
        order: { createdAt: 'DESC' },
      });
      return budgests;
    } catch {
      throw new BadRequestException('Error getting budgets');
    }
  }

  async getOneBudget(budgetId: number, userId: number) {
    return await this.findOneBudget(budgetId, userId);
  }

  async updateBudget(budgetId: number, updateBudgetDto: UpdateBudgetDto, userId: number) {
    const budget = await this.findOneBudget(budgetId, userId);
    try {
      const updateBudget = this.budgetRepository.merge(budget, updateBudgetDto);
      return await this.budgetRepository.save(updateBudget);
    } catch {
      throw new BadRequestException('Error updating budget');
    }
  }

  async deleteBudget(budgetId: number, userId: number) {
    await this.findOneBudget(budgetId, userId);
    try {
      await this.budgetRepository.delete(budgetId);
      return { message: `budget with id ${budgetId} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting budget');
    }
  }

  async findOneBudget(budgetId: number, userId: number) {
    const where = userId ? { id: budgetId, user: { id: userId } } : { id: budgetId };
    const budget = await this.budgetRepository.findOne({ where });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }

    return budget;
  }
}
