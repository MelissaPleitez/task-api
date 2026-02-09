import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from '../../accounts/dto/create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
