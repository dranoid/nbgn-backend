import { CLOUDINARY } from './constant';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';

@Injectable()
export class Cloudinary {}

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    return v2.config({
      cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get('CLOUDINARY_API_KEY'),
      api_secret: configService.get('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  },

  inject: [ConfigService],
};
