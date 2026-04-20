import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards, Put } from '@nestjs/common';
import { RecurringTransactionsService } from '../services/recurring-transactions.service';
import { CreateRecurringTransactionDto } from '../dto/create-recurring-transaction.dto';
import { UpdateRecurringTransactionDto } from '../dto/update-recurring-transaction.dto';
import { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('recurring-transactions')
export class RecurringTransactionsController {
  constructor(private readonly recurringTransactionsService: RecurringTransactionsService) {}

  @Post()
  create(@Body() createRecurringTransactionDto: CreateRecurringTransactionDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.recurringTransactionsService.createRecurringTransaction(createRecurringTransactionDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.recurringTransactionsService.findAllRecurringTransaction(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.recurringTransactionsService.findOneRecurringTransaction(+id, userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateRecurringTransactionDto: UpdateRecurringTransactionDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.recurringTransactionsService.updateRecurringTransaction(+id, updateRecurringTransactionDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.recurringTransactionsService.removeRecurringTransaction(+id, userId);
  }
}
