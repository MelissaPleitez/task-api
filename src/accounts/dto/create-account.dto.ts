import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum AccountType {
  CASH = 'cash',
  BANK = 'bank',
  CREDIT = 'credit',
  SAVINGS = 'savings',
}

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEnum(AccountType, { message: 'Type must be one of the following values: savings, bank, credit, cash' })
  type: AccountType;
}
