import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
}

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive({ message: 'Amount must be a positive number' })
  amount: number;

  @IsEnum(TransactionType, { message: 'Type must be one of: income, expense, transfer' })
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString({}, { message: 'Date must be a valid ISO 8601 date string' })
  date: string;
}
