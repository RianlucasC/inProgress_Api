import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  HttpStatus,
  HttpException,
  Param,
  Delete,
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

    const userId = req.user.sub;
    return this.goalsService.create({
      userId,
      banner_url: bannerUrl,
      ...createGoalDto,
    });
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if (isNaN(pageNumber) || pageNumber <= 0) {
      throw new HttpException(
        'O valor de página deve ser um número positivo.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isNaN(limitNumber) || limitNumber <= 0 || limitNumber > 50) {
      throw new HttpException(
        'O valor de limite deve ser um número positivo e não deve exceder 50.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.goalsService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const IdNumber = Number(id);

    if (isNaN(IdNumber)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }

    return this.goalsService.findOne(IdNumber);
  }

  @Delete(':goalId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('goalId') goalId: string,
    @Req() { user }: IRequestWIthUserInfo,
  ) {
    const numericGoalId = Number(goalId);

    if (isNaN(numericGoalId)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }

    return this.goalsService.remove(user.sub, numericGoalId);
  }
}
