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
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ConferencesService {
  constructor(
    @InjectRepository(Conference)
    private conferenceRepository: Repository<Conference>,
    private cloudinaryService: CloudinaryService,
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
      searchableColumns: ['eventName', 'body', 'speakers', 'id', 'location'],
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
    console.log(updateConferenceDto, 'updateConferenceDto');

    const conference = await this.conferenceRepository.findOne({
      where: { id },
    });

    if (!conference) {
      throw new NotFoundException(`Event with ID: ${id} not found`);
    }

    // Handle image updates and deletions
    if (conference.image) {
      // Check if current image is in deletedImages array
      if (updateConferenceDto.deletedImages?.includes(conference.image)) {
        // If we have a new image, use it
        if (updateConferenceDto.image) {
          conference.image = updateConferenceDto.image;
        } else {
          // If no new image, set to null
          conference.image = null;
        }
      } else if (updateConferenceDto.image) {
        // If we have a new image but current image wasn't marked for deletion
        // Add current image to deletedImages array so it gets cleaned up
        if (!updateConferenceDto.deletedImages) {
          updateConferenceDto.deletedImages = [];
        }
        updateConferenceDto.deletedImages.push(conference.image);
        conference.image = updateConferenceDto.image;
      }
    } else if (updateConferenceDto.image) {
      // No existing image but we have a new one
      conference.image = updateConferenceDto.image;
    }

    // Handle deletion of all images in deletedImages array
    if (updateConferenceDto.deletedImages?.length > 0) {
      for (const imageUrl of updateConferenceDto.deletedImages) {
        try {
          const publicId = imageUrl.split('/').pop()?.split('.')[0];
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        } catch (error) {
          console.error(`Failed to delete image: ${imageUrl}`, error);
        }
      }
    }

    // Remove the deletedImages from the DTO as it's not a database field
    delete updateConferenceDto.deletedImages;

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
