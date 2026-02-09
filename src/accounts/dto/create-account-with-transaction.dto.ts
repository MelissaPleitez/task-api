import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { AccountType } from './create-account.dto';
import { Type } from 'class-transformer';
import { CreateTransactionDto } from './create-transaction.dto';

export class CreateAccountWithTransactionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ValidateNested()
  @Type(() => CreateTransactionDto)
  @IsOptional()
  initialTransaction?: CreateTransactionDto;
}
