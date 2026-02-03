import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @IsEnum(['LOW', 'MEDIUM', 'HEIGH'], { message: 'Priority must be one of the following values: LOW, MEDIUM, HEIGH' })
  priority: string;

  @IsEnum(['PENDING', 'IN_PROGRESS', 'DONE'], { message: 'Status must be one of the following values: PENDING, IN_PROGRESS, DONE' })
  status: string;

  @IsString()
  @IsOptional()
  coverPic?: string;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}
