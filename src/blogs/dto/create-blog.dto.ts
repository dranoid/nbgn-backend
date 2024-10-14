import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  headerImage?: string;

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  @IsNotEmpty({ each: true }) // Ensures each tag is not empty
  tags: string[];

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  author: string;
}
