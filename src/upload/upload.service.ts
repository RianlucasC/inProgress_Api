import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        auth: {
          persistSession: false,
        },
      },
    );
  }

  async uploadAGoalBanner(file: Express.Multer.File) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Apenas arquivos de imagem são permitidos.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { data, error } = await this.supabase.storage
      .from('banners')
      .upload(file.originalname, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (error) {
      throw new HttpException(
        'Erro ao salvar a imagem no armazenamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const bannerUrl = `${process.env.SUPABASE_URL}//storage/v1/object/public/${data.fullPath}`;
    return bannerUrl;
  }

  async updateBanner(oldBannerUrl: string, newBannerFile: Express.Multer.File) {
    if (oldBannerUrl) {
      const oldBannerPath = oldBannerUrl.split('/public/')[1];
      await this.supabase.storage.from('banners').remove([oldBannerPath]);
    }

    const newBannerUrl = await this.uploadAGoalBanner(newBannerFile);
    return newBannerUrl;
  }
}
