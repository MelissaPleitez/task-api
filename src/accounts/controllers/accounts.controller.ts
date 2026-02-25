import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.accountsService.createAccount(createAccountDto, userId);
  }

  @Get()
  findAll() {
    return this.accountsService.findAllAccount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountsService.findOneAccount(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.updateAccount(id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountsService.removeAccount(id);
  }

  @Post('/transaction')
  createTransaction(@Body() countAndTransaction: CreateTransactionDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.accountsService.createTransaction(countAndTransaction, userId);
  }

  @Get(':id/transactions')
  getTransactionsByMonth(@Param('id') id: string, @Query('month') month: string) {
    return this.accountsService.getTransactionsByMonth(id, month);
  }
}
