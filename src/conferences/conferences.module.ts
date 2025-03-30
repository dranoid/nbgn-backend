import { Module } from '@nestjs/common';
import { ConferencesService } from './conferences.service';
import { ConferencesController } from './conferences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conference } from './entities/conference.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Conference]), CloudinaryModule],
  controllers: [ConferencesController],
  providers: [ConferencesService],
})
export class ConferencesModule {}
