import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conference } from './entities/conference.entity';
import { Repository } from 'typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  PaginateQuery,
} from 'nestjs-paginate';

@Injectable()
export class ConferencesService {
  constructor(
    @InjectRepository(Conference)
    private conferenceRepository: Repository<Conference>,
  ) {}

  async create(createConferenceDto: CreateConferenceDto) {
    return await this.conferenceRepository.save(createConferenceDto);
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
    const paginateOptions: PaginateConfig<Conference> = {
      sortableColumns: ['createdAt', 'startDate'],
      defaultSortBy: [['createdAt', 'DESC']],
      searchableColumns: ['eventName', 'body', 'speakers', 'id'],
      filterableColumns: {
        eventName: filterOperations,
        startDate: filterOperations,
        endDate: filterOperations,
        speakers: filterOperations,
        tags: filterOperations,
      },
    };

    return paginate(query, this.conferenceRepository, paginateOptions);
  }

  async findOne(id: string) {
    return await this.conferenceRepository.findOne({ where: { id } });
  }

  async update(id: string, updateConferenceDto: UpdateConferenceDto) {
    const conference = await this.conferenceRepository.findOne({
      where: { id },
    });

    if (!conference) {
      throw new NotFoundException(`Event with ID: ${id} not found`);
    }

    const updatedConference = await this.conferenceRepository.merge(
      conference,
      updateConferenceDto,
    );

    return this.conferenceRepository.save(updatedConference);
  }

  async remove(id: string) {
    return await this.conferenceRepository.delete(id);
  }
}
