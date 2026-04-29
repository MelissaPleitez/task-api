import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../entities/report.entity';
import { Between, Repository } from 'typeorm';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { TransactionType } from '../../transactions/enums/transaction-type.enum';
import { ReportType } from '../enums/report-type.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  // ── core data calculation ──
  private async calculateReportData(userId: number, startDate: Date, endDate: Date) {
    const transactions = await this.transactionRepository.find({
      where: {
        account: { user: { id: userId } },
        date: Between(startDate, endDate),
      },
      relations: ['category', 'account'],
      order: { date: 'DESC' },
    });

    const totalIncome = transactions.filter((t) => t.type === TransactionType.INCOME).reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions.filter((t) => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + Number(t.amount), 0);

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // ── by category ──
    const categoryMap = new Map<number, { categoryId: number; name: string; total: number }>();
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE && t.category)
      .forEach((t) => {
        const id = t.category!.id;
        const name = t.category!.name;
        const existing = categoryMap.get(id);
        if (existing) {
          existing.total += Number(t.amount);
        } else {
          categoryMap.set(id, { categoryId: id, name, total: Number(t.amount) });
        }
      });
    const byCategory = Array.from(categoryMap.values()).sort((a, b) => b.total - a.total);

    // ── by account ──
    const accountMap = new Map<number, { accountId: number; name: string; total: number }>();
    transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .forEach((t) => {
        const id = t.account.id;
        const name = t.account.name;
        const existing = accountMap.get(id);
        if (existing) {
          existing.total += Number(t.amount);
        } else {
          accountMap.set(id, { accountId: id, name, total: Number(t.amount) });
        }
      });
    const byAccount = Array.from(accountMap.values()).sort((a, b) => b.total - a.total);

    // ── top 5 expenses ──
    const topExpenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .sort((a, b) => Number(b.amount) - Number(a.amount))
      .slice(0, 5)
      .map((t) => ({
        description: t.description ?? 'No description',
        amount: Number(t.amount),
        date: t.date,
        category: t.category?.name ?? null,
        account: t.account.name,
      }));

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
      savingsRate: Math.round(savingsRate * 100) / 100,
      byCategory,
      byAccount,
      topExpenses,
      transactionCount: transactions.length,
    };
  }

  // ── auto generate title ──
  private generateTitle(type: ReportType, startDate: Date, endDate: Date): string {
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    switch (type) {
      case ReportType.WEEKLY:
        return `Weekly Report — ${fmt(startDate)} to ${fmt(endDate)}`;
      case ReportType.MONTHLY:
        return `Monthly Report — ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
      case ReportType.YEARLY:
        return `Yearly Report — ${startDate.getFullYear()}`;
      case ReportType.CUSTOM:
        return `Custom Report — ${fmt(startDate)} to ${fmt(endDate)}`;
    }
  }

  async createReport(createReportDto: CreateReportDto, userId: number) {
    console.log('1. createReport called:', createReportDto, 'userId:', userId);
    try {
      const startDate = new Date(createReportDto.startDate);
      const endDate = new Date(createReportDto.endDate);
      console.log('2. dates parsed:', startDate, endDate);

      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      console.log('3. calling calculateReportData...');
      const data = await this.calculateReportData(userId, startDate, endDate);
      console.log('4. data calculated:', data);

      const newReport = this.reportsRepository.create({
        type: createReportDto.type,
        title: createReportDto.title ?? this.generateTitle(createReportDto.type, startDate, endDate),
        startDate,
        endDate,
        data,
        user: { id: userId },
      });

      console.log('5. saving report...');
      return await this.reportsRepository.save(newReport);
    } catch (error) {
      console.error('ERROR in createReport:', error); // ← this will show the real error
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Unable to create report');
    }
  }

  async findAllReports(userId: number) {
    try {
      return await this.reportsRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' }, // ← newest first
      });
    } catch {
      throw new BadRequestException('Error fetching reports');
    }
  }

  async getOneReport(reportId: number, userId: number) {
    const report = await this.reportsRepository.findOne({
      where: { id: reportId, user: { id: userId } },
    });
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  // ── recalculates the snapshot on demand ──
  async regenerateReport(reportId: number, userId: number) {
    const report = await this.getOneReport(reportId, userId);
    try {
      report.data = await this.calculateReportData(userId, report.startDate, report.endDate);
      return await this.reportsRepository.save(report);
    } catch {
      throw new BadRequestException('Error regenerating report');
    }
  }

  async removeReport(reportId: number, userId: number) {
    await this.getOneReport(reportId, userId);
    try {
      await this.reportsRepository.delete(reportId);
      return { message: `Report with id ${reportId} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting report');
    }
  }

  async findOneReport(reportId: number, userId: number) {
    return this.getOneReport(reportId, userId);
  }
}
