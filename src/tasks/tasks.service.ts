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

  async CreateTask(createTaskDto: CreateTaskDto, id: string) {
    try {
      const task = this.tasksRepository.create(createTaskDto);
      await this.tasksRepository.save({
        ...task,
        user: { id: parseInt(id) },
      });
      return task;
    } catch {
      throw new BadRequestException('Error creating task');
    }
  }

  async findAllTask() {
    return await this.tasksRepository.find();
  }

  async findOneTask(id: number) {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
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
}
