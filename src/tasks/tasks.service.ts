import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAllTask() {
    return await this.tasksRepository.find({
      relations: ['user.profile'],
    });
  }

  async findOneTask(id: string) {
    const task = await this.tasksRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['user.profile'],
    });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async CreateTask(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.tasksRepository.save({
        ...createTaskDto,
        user: { id: createTaskDto.userId },
      });
      return this.findOneTask(task.id.toString());
    } catch {
      throw new BadRequestException('Error creating task');
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const tasks = await this.tasksRepository.findOneBy({ id });
      if (!tasks) {
        throw new NotFoundException('Task not found');
      }
      const updatedTask = this.tasksRepository.merge(tasks, updateTaskDto);
      const savedTask = await this.tasksRepository.save(updatedTask);
      return savedTask;
    } catch {
      throw new BadRequestException('Error updating task');
    }
  }

  async removeTask(id: number) {
    try {
      await this.tasksRepository.delete(id);
      return { message: `Task with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting task');
    }
  }

  //Getting tasks for a specific user
  async GetTasksByUserId(userId: string) {
    const id = Number(userId);
    try {
      const tasks = await this.tasksRepository.find({
        where: { user: { id: id } },
        relations: ['user.profile'],
      });

      if (tasks.length === 0) {
        throw new NotFoundException(`No tasks found for user with id ${userId}`);
      }
      return tasks;
    } catch (error) {
      console.error('GetTasksByUserId error:', error);
      throw new BadRequestException('Error fetching tasks for the user');
    }
  }
}
