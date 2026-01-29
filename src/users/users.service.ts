import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos/users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
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

  async createUser(user: CreateUserDto) {
    try {
      const newUser = await this.usersRepository.save(user);
      return newUser;
    } catch {
      throw new BadRequestException('Error creating user');
    }
  }

  async UpdateUser(id: string, users: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: parseInt(id) },
        relations: {
          profile: true,
        },
      });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found `);
      }
      console.log(user);
      const updatedUser = this.usersRepository.merge(user, users);
      const saverUser = await this.usersRepository.save(updatedUser);
      return saverUser;
    } catch {
      throw new BadRequestException('Error updating user');
    }
  }

  async deleteUser(id: string) {
    try {
      await this.usersRepository.delete(id);
      return {
        error: `User with id ${id} was deleted`,
      };
    } catch {
      throw new BadRequestException('Error deleting user');
    }
  }

  // PROFILE
  async findOneProfile(id: string) {
    const profile = await this.profilesRepository.findOne({
      where: { id: parseInt(id) },
      relations: {
        user: true,
      },
    });
    if (!profile) {
      throw new NotFoundException(`profile with id ${id} not found `);
    }

    return profile;
  }
}
