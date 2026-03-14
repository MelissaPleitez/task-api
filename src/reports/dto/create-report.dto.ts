import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportType } from '../enums/report-type.enum.ts';

export class CreateReportDto {
  @IsEnum(ReportType)
  type: ReportType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
