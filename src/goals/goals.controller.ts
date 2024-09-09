import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { IRequestWIthUserInfo } from 'src/auth/types/IResquestWIthUserInfo';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

@Controller('goals')
export class GoalsController {
  constructor(
    private readonly goalsService: GoalsService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async create(
    @Req() req: IRequestWIthUserInfo,
    @Body('data') data: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createGoalDto =
      await this.goalsService.transformAndValidateGoalDto(data);
    let bannerUrl: string = null;

    if (file) {
      bannerUrl = await this.uploadService.uploadAGoalBanner(file);
    }

    const userId = req.user.userId;
    return this.goalsService.create({
      userId,
      banner_url: bannerUrl,
      ...createGoalDto,
    });
  }
}
