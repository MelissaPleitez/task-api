import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AccountType } from '../enums/account-type.enum';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEnum(AccountType, { message: 'Type must be one of the following values: savings, bank, credit, cash' })
  accountType: AccountType;
}
