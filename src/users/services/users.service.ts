import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
    private cloudinaryService: CloudinaryService,
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
      const newUser = this.usersRepository.create(user);
      const savedUser = await this.usersRepository.save(newUser);
      return this.findOneUser(savedUser.id.toString());
    } catch (error) {
      throw new BadRequestException(`Error creating user: ${error}`);
    }
  }

  // ── upload avatar ──
  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const profile = await this.profilesRepository.findOne({
      where: { user: { id: parseInt(userId) } },
    });
    if (!profile) throw new NotFoundException('Profile not found');

    // upload to cloudinary — if user already has avatar,
    // it gets overwritten automatically because we use user-{id} as public_id
    const avatarUrl = await this.cloudinaryService.uploadAvatar(file, userId);

    profile.avatarPic = avatarUrl;
    await this.profilesRepository.save(profile);

    return { avatarPic: avatarUrl };
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
        message: `User with id ${id} was deleted`,
      };
    } catch {
      throw new BadRequestException('Error deleting user');
    }
  }

  // FIND USER BY EMAIL
  async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({
      email: email,
    });
    return user;
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
