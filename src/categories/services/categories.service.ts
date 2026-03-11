import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
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

  async findAllCategories(userId: number) {
    try {
      const category = await this.categoryRepository.find({
        where: [{ user: { id: userId } }, { isSystem: true }],
        order: { isSystem: 'DESC', name: 'ASC' },
      });
      return category;
    } catch {
      throw new BadRequestException('Error getting categories');
    }
  }

  async getOneCategory(id: number, userId: number) {
    return this.findOneCategory(id, userId);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto, userId: number) {
    const category = await this.findOneCategory(id, userId);
    try {
      const updateCatory = this.categoryRepository.merge(category, updateCategoryDto);
      return await this.categoryRepository.save(updateCatory);
    } catch {
      throw new BadRequestException('Error updating category');
    }
  }

  async removeCategory(id: number, userId: number) {
    await this.findOneCategory(id, userId);
    try {
      await this.categoryRepository.delete(id);
      return { message: `Category with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting category');
    }
  }

  async findOneCategory(categoryId: number, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId, user: { id: userId }, isSystem: false },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
