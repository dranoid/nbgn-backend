import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ConferencesService } from './conferences.service';
import { CreateConferenceDto } from './dto/create-conference.dto';
import { UpdateConferenceDto } from './dto/update-conference.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesEnum } from 'src/auth/dto/roles.enum';
import { RolesGuard } from 'src/auth/auth.guard';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CATCH_WATERMARK } from '@nestjs/common/constants';

@Controller('conferences')
export class ConferencesController {
  constructor(
    private readonly conferencesService: ConferencesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'eventImages', maxCount: 10 },
    ]),
  )
  async create(
    @Body(new ValidationPipe({ transform: true }))
    createConferenceDto: CreateConferenceDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      eventImages?: Express.Multer.File[];
    },
  ) {
    // Add size validation after files are fully loaded
    if (files.image?.[0] && files.image[0].size > 5 * 1024 * 1024) {
      throw new BadRequestException('Main image exceeds 5MB limit');
    }

    if (files.eventImages?.some((file) => file.size > 5 * 1024 * 1024)) {
      throw new BadRequestException(
        'One or more event images exceed 5MB limit',
      );
    }

    // Handle main event image upload
    let imageUrl;
    if (files.image?.[0]) {
      const result = await this.cloudinaryService.uploadImage(files.image[0]);
      imageUrl = result.secure_url;
    }

    // Handle multiple event images upload
    const eventImagesUrls = [];
    if (files.eventImages) {
      for (const file of files.eventImages) {
        const result = await this.cloudinaryService.uploadImage(file);
        eventImagesUrls.push(result.secure_url);
      }
    }

    const payload = {
      ...createConferenceDto,
      image: imageUrl,
      eventImages: eventImagesUrls,
    };

    return this.conferencesService.create(payload);
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.conferencesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conferencesService.findOne(id);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'newEventImages', maxCount: 10 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateConferenceDto: UpdateConferenceDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      newEventImages?: Express.Multer.File[];
    },
  ) {
    // Log incoming data
    console.log('=== INCOMING UPDATE REQUEST ===');
    console.log('Files received:', {
      image: files.image?.map((f) => ({
        filename: f.originalname,
        size: f.size,
      })),
      newEventImages: files.newEventImages?.map((f) => ({
        filename: f.originalname,
        size: f.size,
      })),
    });
    console.log('Form data received:', {
      ...updateConferenceDto,
      deletedImages:
        updateConferenceDto.deletedImages?.slice(0, 100).join(', ') + '...',
    });

    // Add size validation for uploaded files
    if (files.image?.[0] && files.image[0].size > 5 * 1024 * 1024) {
      throw new BadRequestException('Main image exceeds 5MB limit');
    }

    if (files.newEventImages?.some((file) => file.size > 5 * 1024 * 1024)) {
      throw new BadRequestException(
        'One or more event images exceed 5MB limit',
      );
    }

    // Handle main image upload if provided
    let imageUrl;
    if (files.image?.[0]) {
      const result = await this.cloudinaryService.uploadImage(files.image[0]);
      imageUrl = result.secure_url;
      console.log('Uploaded main image:', imageUrl);
    }

    // Handle new event images upload
    const newEventImagesUrls = [];
    if (files.newEventImages) {
      for (const file of files.newEventImages) {
        const result = await this.cloudinaryService.uploadImage(file);
        newEventImagesUrls.push(result.secure_url);
      }
      console.log('Uploaded new event images:', newEventImagesUrls);
    }

    // Combine existing and new images/descriptions
    const finalEventImages = [
      ...updateConferenceDto.eventImages,
      ...newEventImagesUrls,
    ];
    const finalEventImageDescriptions = [
      ...updateConferenceDto.eventImageDescriptions,
      ...(updateConferenceDto.newEventImageDescriptions
        ? updateConferenceDto.newEventImageDescriptions
        : []),
    ];

    console.log('Final arrays:', {
      finalEventImages,
      finalEventImageDescriptions,
    });

    // Prepare the final update payload
    const payload = {
      ...updateConferenceDto,
      image: imageUrl || undefined,
      eventImages: finalEventImages,
      eventImageDescriptions: finalEventImageDescriptions,
      // Convert speakers array if it exists
      speakers: Array.isArray(updateConferenceDto.speakers)
        ? updateConferenceDto.speakers
        : [updateConferenceDto.speakers].filter(Boolean),
      // Pass the deletedImages array to the service so it can handle the deletion logic
      deletedImages: updateConferenceDto.deletedImages,
    };

    // Remove form data specific fields that shouldn't go to the database
    delete payload.newEventImageDescriptions;

    console.log('Final payload:', payload);
    return this.conferencesService.update(id, payload);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conferencesService.remove(id);
  }
}
