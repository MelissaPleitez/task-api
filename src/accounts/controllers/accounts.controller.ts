import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { CreateAccountWithTransactionDto } from '../dto/create-account-with-transaction.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.createAccount(createAccountDto);
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
  createAccountWithTransaction(@Body() countAndTransaction: CreateAccountWithTransactionDto) {
    return this.accountsService.createAccountWithInitialTransaction(countAndTransaction);
  }
}
