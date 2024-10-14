import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Title } from './user.enum';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(Title)
  @IsNotEmpty()
  title: Title;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  affiliation: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @IsString()
  @IsNotEmpty()
  highestDegree: string;

  @IsString()
  @IsNotEmpty()
  careerStatus: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
