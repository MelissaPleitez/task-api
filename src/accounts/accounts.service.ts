import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto, id: string) {
    try {
      const account = this.accountsRepository.create(createAccountDto);
      await this.accountsRepository.save({
        ...account,
        user: { id: parseInt(id) },
      });
      return account;
    } catch {
      throw new BadRequestException('Error creating account');
    }
  }

  findAllAccount() {
    try {
      const acounts = this.accountsRepository.find({
        relations: {
          user: true,
        },
      });
      return acounts;
    } catch {
      throw new BadRequestException('Error fetching accounts');
    }
  }

  findOneAccount(id: number) {
    try {
      const account = this.accountsRepository.findOneBy({ id });
      return account;
    } catch {
      throw new BadRequestException('Account not found');
    }
  }

  async updateAccount(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await this.accountsRepository.findOneBy({ id });
    if (!account) {
      throw new BadRequestException('Account not found');
    }
    try {
      const updatedAccount = this.accountsRepository.merge(account, updateAccountDto);
      const savedAccount = await this.accountsRepository.save(updatedAccount);
      return savedAccount;
    } catch {
      throw new BadRequestException('Error updating account');
    }
  }

  removeAccount(id: number) {
    try {
      const account = this.accountsRepository.delete(id);
      return account;
    } catch {
      throw new BadRequestException('Error deleting finalcial account');
    }
  }
}
