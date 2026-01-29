import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['LOW', 'MEDIUM', 'HEIGH'], { message: 'Priority must be one of the following values: low, medium, high' })
  priority: string;

  @IsEnum(['PENDING', 'IN_PROGRESS', 'DONE'], { message: 'Status must be one of the following values: pending, in_progress, done' })
  status: string;

  @IsString()
  @IsOptional()
  coverPic?: string;
}
