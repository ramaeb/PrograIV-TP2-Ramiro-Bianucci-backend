import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Estas credenciales las obtenés gratis registrándote en cloudinary.com
    cloudinary.config({
      cloud_name: 'dn0hy4cuo',
      api_key: '328976898991517',
      api_secret: 'YHUnyQ6M-Ed6M0L8moLMso5AUN8',
    });
  }

  async subirImagen(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'red_social_perfiles' }, 
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}