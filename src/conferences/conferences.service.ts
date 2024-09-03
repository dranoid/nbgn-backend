import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conference } from './entities/conference.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConferencesService {
  constructor(
    @InjectRepository(Conference)
    private conferenceRepository: Repository<Conference>,
  ) {}

  async create(createConferenceDto: CreateConferenceDto) {
    return await this.conferenceRepository.save(createConferenceDto);
  }

  async findAll() {
    return await this.conferenceRepository.find();
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

    this.conferenceRepository.save(updatedConference);
  }

  async remove(id: string) {
    return await this.conferenceRepository.delete(id);
  }
}
