import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'kqfood',
        },
        (error, result) => {
          // 1. Nếu có lỗi từ Cloudinary -> Reject ngay
          if (error) return reject(error);

          if (!result) {
            return reject(new Error('Cloudinary upload failed: No result returned'));
          }

          // 3. Lúc này TypeScript đã biết chắc chắn result không null -> Resolve ok
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}