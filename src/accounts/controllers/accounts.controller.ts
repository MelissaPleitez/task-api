import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { AccountsService } from '../services/accounts.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';

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
  findAll(@Req() req: Request) {
    const payload = req.user as Payload;
    return this.accountsService.findAllAccount(payload.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.accountsService.findOneAccount(parseInt(id), payload.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.accountsService.updateAccount(id, updateAccountDto, payload.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    return this.accountsService.removeAccount(id, payload.sub);
  }

  // @Post('/transaction')
  // createTransaction(@Body() countAndTransaction: CreateTransactionDto, @Req() req: Request) {
  //   const payload = req.user as Payload;
  //   const userId = payload.sub;
  //   return this.accountsService.createTransaction(countAndTransaction, userId);
  // }

  // @Get(':id/transactions')
  // getTransactionsByMonth(@Param('id') id: string, @Query('month') month: string) {
  //   return this.accountsService.getTransactionsByMonth(id, month);
  // }
}
