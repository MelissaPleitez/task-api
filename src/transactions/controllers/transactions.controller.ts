import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { PaginationDto } from 'src/pagination/dto/create-pagination.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.transactionsService.create(dto, payload.sub);
  }

  @Get('account/:accountId')
  findAllByAccount(@Param('accountId') accountId: string, @Query() pagination: PaginationDto, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.transactionsService.findAllByAccount(+accountId, payload.sub, pagination);
  }

  @Get('account/:accountId/month')
  findByMonth(@Param('accountId') accountId: string, @Query('month') month: string, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.transactionsService.findByMonth(+accountId, month, payload.sub);
  }

  @Get('account/:accountId/total')
  totalByAccount(@Param('accountId') accountId: string, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.transactionsService.totalByAccount(+accountId, payload.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.transactionsService.update(+id, dto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.transactionsService.remove(+id, payload.sub);
  }
}
