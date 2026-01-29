import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  bio: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatarPic?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
