import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.CreateTask(createTaskDto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAllTask();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOneTask(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.updateTask(+id, updateTaskDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.removeTask(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/profile')
  getTaskById(@Param('id') id: string) {
    return this.tasksService.GetTasksByUserId(id);
  }
}
