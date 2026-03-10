import { IsEnum, IsHexColor, IsOptional, IsString, MaxLength } from 'class-validator';
import { TransactionType } from 'src/transactions/enums/transaction-type.enum';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(80)
  name: string;

  @IsOptional()
  @MaxLength(10)
  @IsString()
  icon?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;

  @IsEnum(TransactionType)
  type: TransactionType;
}
