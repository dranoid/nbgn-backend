import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
