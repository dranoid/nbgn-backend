import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // const user = await this.userService.validateUser(loginDto);
    let user;
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    const payload = {
      username: user.username,
      sub: user.id,
      verifiedUser: user.verifiedUser,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    // const user = await this.userService.createUser(registerDto);
    let user;
    const payload = {
      username: user.username,
      sub: user.id,
      verifiedUser: user.verifiedUser,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
