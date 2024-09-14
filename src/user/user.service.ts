import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // For Admin CRUD
    // membershipId is automatically generated and verified is defaulted to false
    return this.userRepository.save(createUserDto);
  }

  async findAll(query: PaginateQuery) {
    const filterOperations = [
      FilterOperator.BTW,
      FilterOperator.GT,
      FilterOperator.GTE,
      FilterOperator.LTE,
      FilterOperator.LT,
      FilterOperator.EQ,
    ];
    const paginateOptions: PaginateConfig<User> = {
      sortableColumns: ['createdAt', 'affiliation', 'membershipId'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: [
        'id',
        'firstName',
        'lastName',
        'membershipId',
        'affiliation',
        'email',
        'phoneNumber',
      ],
      filterableColumns: {
        verified: filterOperations,
      },
    };

    return paginate(query, this.userRepository, paginateOptions);
  }

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const userWithoutPasswordAndRoles = { ...user };
    delete userWithoutPasswordAndRoles.password;
    delete userWithoutPasswordAndRoles.roles;

    return userWithoutPasswordAndRoles;
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userRepository.merge(user, updateUserDto);

    return this.userRepository.save(updatedUser);
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }
}
