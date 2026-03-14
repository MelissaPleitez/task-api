import { Module } from '@nestjs/common';
import { RecurringTransactionsService } from './services/recurring-transactions.service';
import { RecurringTransactionsController } from './controllers/recurring-transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecurringTransaction } from './entities/recurring-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecurringTransaction])],
  controllers: [RecurringTransactionsController],
  providers: [RecurringTransactionsService],
  exports: [RecurringTransactionsService],
})
export class RecurringTransactionsModule {}
