import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAllUsers();
  }
  @Get(':id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Delete(':id')
  deleteUsers(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  updateUsers(@Param('id') id: string, @Body() NewBody: UpdateUserDto) {
    return this.usersService.UpdateUser(id, NewBody);
  }

  // PROFILE
  @Get(':id/profile')
  async findUserProfile(@Param('id') id: string) {
    const user = await this.usersService.findOneProfile(id);
    return user;
  }
}
