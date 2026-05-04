import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Payload } from 'src/auth/models/payload.model';

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.tasksService.CreateTask(createTaskDto, userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.tasksService.findAllTask(userId);
  }

  @Get('total')
  getTotalTaskCompleted() {
    return this.tasksService.getStatusTotalTask();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.tasksService.findOneTask(parseInt(id), userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.tasksService.updateTask(parseInt(id), updateTaskDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const payload = req.user as Payload;
    const userId = payload.sub;
    return this.tasksService.removeTask(+id, userId);
  }
}
