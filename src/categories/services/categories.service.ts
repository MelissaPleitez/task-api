import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: number) {
    try {
      const category = this.categoryRepository.create({
        name: createCategoryDto.name,
        icon: createCategoryDto.icon,
        color: createCategoryDto.color,
        type: createCategoryDto.type,
        isSystem: false,
        user: { id: userId },
      });

      const saverCategory = await this.categoryRepository.save(category);
      return this.categoryRepository.findOne({
        where: { id: saverCategory.id },
        relations: ['user'],
      });
    } catch {
      throw new BadRequestException('Error creating category');
    }
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
