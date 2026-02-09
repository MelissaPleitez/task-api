import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from '../users/services/users.service';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  // imports: [UsersService],
})
export class UsersModule {}
