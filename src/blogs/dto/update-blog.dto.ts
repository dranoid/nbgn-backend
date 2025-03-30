import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsOptional, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value ? [value] : [],
  )
  deletedImages?: string[];

  // Dynamic fields for new images and descriptions will be handled in the controller
  [key: string]: any;
}
