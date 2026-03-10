import { Module } from '@nestjs/common';
import { RecurringTransactionsService } from './recurring-transactions.service';
import { RecurringTransactionsController } from './controllers/recurring-transactions.controller';

@Module({
  controllers: [RecurringTransactionsController],
  providers: [RecurringTransactionsService],
})
export class RecurringTransactionsModule {}
