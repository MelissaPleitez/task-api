import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post(':id')
  create(@Body() createAccountDto: CreateAccountDto, @Param('id') id: string) {
    return this.accountsService.createAccount(createAccountDto, id);
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
}
