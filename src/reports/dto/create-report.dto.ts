import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportType } from '../enums/report-type.enum';

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
