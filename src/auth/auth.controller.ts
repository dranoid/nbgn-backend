import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import {
  ForgotPasswordDto,
  ChangePasswordDto,
} from 'src/auth/dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUserProfile(req);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.userId;
    return this.authService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  // TODO: forgot password
}
