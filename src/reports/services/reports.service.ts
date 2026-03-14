import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from '../dto/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from '../entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>) {}
  async createReport(createReportDto: CreateReportDto, userId: number) {
    try {
      const newReport = this.reportsRepository.create({
        type: createReportDto.type,
        title: createReportDto.title ?? `${createReportDto.type} report ${createReportDto.startDate} to ${createReportDto.endDate}`,
        startDate: new Date(createReportDto.startDate),
        endDate: new Date(createReportDto.endDate),
        user: { id: userId },
      });
      return await this.reportsRepository.save(newReport);
    } catch {
      throw new BadRequestException('Unable to create report');
    }
  }

  async findAllReports(userId: number) {
    try {
      const reports = await this.reportsRepository.find({
        where: { user: { id: userId } },
        order: { createdAt: 'ASC' },
      });
      return reports;
    } catch {
      throw new BadRequestException('Error fetching reports');
    }
  }

  findOneReport(id: number, userId: number) {
    return this.getOneReport(id, userId);
  }

  async removeReport(id: number, userId: number) {
    await this.getOneReport(id, userId);
    try {
      await this.reportsRepository.delete(id);
      return { message: `Report with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting report');
    }
  }

  async getOneReport(id: number, userId: number) {
    const report = await this.reportsRepository.findOne({
      where: { id: id, user: { id: userId } },
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }
}
