import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskCategory, TaskPriority, TaskStatus } from '../enums/tasks-type.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskCategory, { message: 'Priority must be one of the following values: LOW, MEDIUM, HEIGH' })
  category: TaskCategory;

  @IsEnum(TaskPriority, { message: 'Priority must be one of the following values: LOW, MEDIUM, HEIGH' })
  priority: TaskPriority;

  @IsEnum(TaskStatus, { message: 'Status must be one of the following values: PENDING, IN_PROGRESS, DONE' })
  status: TaskStatus;

  @IsString()
  @IsOptional()
  coverPic?: string;
}
