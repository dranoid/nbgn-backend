import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RolesEnum } from './dto/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userWithoutPasswordAndRoles = { ...user };
    delete userWithoutPasswordAndRoles.password;
    delete userWithoutPasswordAndRoles.roles;
    const payload = { sub: user.id, email: user.email, role: user.roles };
    return {
      user: userWithoutPasswordAndRoles,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    // membershipId is automatically generated and verified is defaulted to false
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = this.userRepository.create({
      ...createUserDto,
      email,
      password: hashedPassword,
      roles: [RolesEnum.User],
    });
    createdUser.verified = false;
    createdUser.membershipId = await this.generateMembershipId();
    const user = await this.userRepository.save(createdUser);
    // TODO: remove the roles field and add it to the jwt
    const userWithoutPasswordAndRoles = { ...user };
    delete userWithoutPasswordAndRoles.password;
    delete userWithoutPasswordAndRoles.roles;
    const payload = { sub: user.id, email: user.email, role: user.roles };
    const accessToken = this.jwtService.sign(payload);
    return { user: userWithoutPasswordAndRoles, accessToken };
  }

  async getUserProfile(req: any) {
    const userId = req['user'].userId;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userWithoutPasswordAndRoles = { ...user };
    delete userWithoutPasswordAndRoles.password;
    delete userWithoutPasswordAndRoles.roles;
    return {
      user: userWithoutPasswordAndRoles,
    };
  }

  async generateMembershipId() {
    const [_users, count] = await this.userRepository.findAndCount();
    const currentYear = new Date().getFullYear();
    const membershipId = `NBGN/${currentYear}/${count + 1}`;
    return membershipId;
  }
}
