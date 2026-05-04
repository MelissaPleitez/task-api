import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from '../enums/tasks-type.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async findAllTask(userId: number) {
    return await this.tasksRepository.find({
      where: { user: { id: userId } },
    });
  }

  async CreateTask(createTaskDto: CreateTaskDto, userId: number) {
    try {
      const task = await this.tasksRepository.save({
        ...createTaskDto,
        user: { id: userId },
      });
      return this.findOneTask(task.id, userId);
    } catch {
      throw new BadRequestException('Error creating task');
    }
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto, userId: number) {
    try {
      const where = userId ? { id: id, user: { id: userId } } : { id: id };
      const tasks = await this.tasksRepository.findOne({ where });
      if (!tasks) {
        throw new NotFoundException('Task not found');
      }
      const updatedTask = this.tasksRepository.merge(tasks, updateTaskDto);
      return await this.tasksRepository.save(updatedTask);
    } catch {
      throw new BadRequestException('Error updating task');
    }
  }

  async removeTask(id: number, userId: number) {
    const where = userId ? { id: id, user: { id: userId } } : { id: id };
    const tasks = await this.tasksRepository.findOne({ where });
    if (!tasks) {
      throw new NotFoundException('Task not found');
    }
    try {
      await this.tasksRepository.delete(id);
      return { message: `Task with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Error deleting task');
    }
  }

  async getStatusTotalTask() {
    try {
      const taskCompleted = await this.tasksRepository.findBy({ status: TaskStatus.DONE });
      const taskOnGoing = await this.tasksRepository.findBy({ status: TaskStatus.IN_PROGRESS });
      const taskStart = await this.tasksRepository.findBy({ status: TaskStatus.PENDING });
      const taskTotal = {
        taskCompleted: taskCompleted.length,
        taskOnGoing: taskOnGoing.length,
        taskStart: taskStart.length,
      };
      return taskTotal;
    } catch {
      throw new BadRequestException('Error getting total completed tasks');
    }
  }

  async findOneTask(id: number, userId: number) {
    const where = userId ? { id: id, user: { id: userId } } : { id: id };
    const task = await this.tasksRepository.findOne({ where });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }
}
