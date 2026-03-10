import { IsDateString, IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Type must be one of: income, expense, transfer' })
  type: TransactionType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString({}, { message: 'Date must be a valid ISO 8601 date string' })
  date: string;

  @IsNumber()
  accountId: number;

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}
