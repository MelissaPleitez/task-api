import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAllUsers() {
    const user = await this.usersRepository.find({
      relations: {
        profile: true,
      },
    });
    return user;
  }

  async findOneUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found `);
    }
    return user;
  }

  async findOneProfile(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(id) },
      relations: { profile: true },
    });
    if (!user) {
      throw new NotFoundException(`profile with id ${id} not found `);
    }
    if (!user.profile) {
      throw new NotFoundException(`Profile for user ${id} not found`);
    }
    return user.profile;
  }

  async createUser(user: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async UpdateUser(id: string, users: UpdateUserDto) {
    const user = await this.usersRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found `);
    }

    const updatedUser = this.usersRepository.merge(user, users);
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found `);
    }
    await this.usersRepository.delete(user.id);
    return {
      error: `User with id ${id} was deleted`,
    };
  }
}
