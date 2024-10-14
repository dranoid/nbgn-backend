import {
  IsString,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreateConferenceDto {
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  speakers: string[];

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  eventImages?: string[];

  @IsOptional()
  @IsString()
  eventImageDesc?: string;
}
