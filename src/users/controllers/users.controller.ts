import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto';
import { UsersService } from '../services/users.service';

const multerConfig = {
  storage: memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
      cb(new Error('Only image files are allowed'), false);
    } else {
      cb(null, true);
    }
  },
};

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

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  uploadAvatar(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new Error('No file uploaded');
    return this.usersService.uploadAvatar(id, file);
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
