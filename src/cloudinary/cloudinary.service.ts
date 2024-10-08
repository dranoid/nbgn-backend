import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';

import { Injectable } from '@nestjs/common';

import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    options: UploadApiOptions = {},
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadOptions: UploadApiOptions = {
        ...options,
        filename_override: file.originalname,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      const upload = v2.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
