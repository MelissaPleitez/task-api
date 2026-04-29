import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import 'multer';

@Injectable()
export class CloudinaryService {
  async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars', // organized in a folder in Cloudinary
          public_id: `user-${userId}`, // overrides old avatar automatically
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // auto crop to face
            { quality: 'auto', fetch_format: 'auto' }, // auto optimize
          ],
        },
        (error, result) => {
          if (error || !result) return reject(new BadRequestException('Upload failed'));
          resolve(result.secure_url); // ← always https, works in production
        },
      );

      // convert buffer to stream and pipe to cloudinary
      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteAvatar(userId: string): Promise<void> {
    await cloudinary.uploader.destroy(`avatars/user-${userId}`);
  }
}
