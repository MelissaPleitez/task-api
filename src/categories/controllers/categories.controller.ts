import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Payload } from 'src/auth/models/payload.model';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.categoriesService.createCategory(createCategoryDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.categoriesService.findAllCategories(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.categoriesService.getOneCategory(parseInt(id), userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.categoriesService.updateCategory(+id, updateCategoryDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.categoriesService.removeCategory(parseInt(id), userId);
  }
}
