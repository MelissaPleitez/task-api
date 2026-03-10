import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { BudgetPeriod } from '../enums/budget-period.enum';

export class CreateBudgetDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  limitAmount: number;

  @IsEnum(BudgetPeriod)
  period: BudgetPeriod;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  alertEnabled?: boolean;

  @IsNumber()
  @IsOptional()
  alertThreshPct?: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  accountId?: number;
}
