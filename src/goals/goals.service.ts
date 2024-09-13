import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ICreateGoal } from './types/ICreateGoal';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UploadService } from 'src/upload/upload.service';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
    private uploadService: UploadService,
  ) {}

  async create({ userId, title, description, banner_url }: ICreateGoal) {
    const user = await this.usersService.findOne(userId);

    const goal = this.goalRepository.create({
      title,
      description,
      user: user,
      banner_url,
    });

    const savedGoal = await this.goalRepository.save(goal);

    return { id: savedGoal.id };
  }

  async findAll(page, limit) {
    const goals = await this.goalRepository
      .createQueryBuilder('goal')
      .leftJoinAndSelect('goal.user', 'user')
      .select(['goal', 'user.id', 'user.avatar_url', 'user.username'])
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return goals;
  }

  async findOne(id: number) {
    const goal = await this.goalRepository
      .createQueryBuilder('goal')
      .leftJoinAndSelect('goal.user', 'user')
      .select([
        'goal.id',
        'goal.title',
        'goal.description',
        'goal.createdAt',
        'user.id',
        'user.avatar_url',
        'user.username',
      ])
      .where('goal.id = :id', { id })
      .getOne();

    return goal;
  }

  async remove(userId, goalId) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId },
      relations: {
        user: true,
      },
    });

    if (!goal) {
      throw new HttpException('Meta não encontrada.', HttpStatus.NOT_FOUND);
    }

    const goalBelongsToTheUser = goal.user.id === userId;

    if (!goalBelongsToTheUser) {
      throw new HttpException(
        'Essa meta pertence a outro usuário.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.goalRepository.remove(goal);
  }

  async update(
    goalId: number,
    userId: number,
    UpdateGoalDto: UpdateGoalDto,
    newBanner: Express.Multer.File,
  ) {
    const goal = await this.goalRepository.findOne({
      where: { id: goalId },
      relations: {
        user: true,
      },
    });

    if (!goal) {
      throw new HttpException('Meta não encontrada.', HttpStatus.NOT_FOUND);
    }

    const goalBelongsToTheUser = goal.user.id === userId;

    if (!goalBelongsToTheUser) {
      throw new HttpException(
        'Essa meta pertence a outro usuário.',
        HttpStatus.FORBIDDEN,
      );
    }

    let banner_url = goal.banner_url;

    if (newBanner) {
      try {
        const newBannerUrl = await this.uploadService.updateBanner(
          goal.banner_url,
          newBanner,
        );
        banner_url = newBannerUrl;
      } catch (error) {
        throw new HttpException(
          'Erro ao atualizar o banner.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    await this.goalRepository.update(goalId, { banner_url, ...UpdateGoalDto });
  }

  async transformAndValidateGoalDto(data: string): Promise<CreateGoalDto> {
    let createGoalDto: CreateGoalDto;
    try {
      const parsedData = JSON.parse(data);
      createGoalDto = plainToInstance(CreateGoalDto, parsedData);
    } catch (error) {
      throw new BadRequestException('Dados JSON inválidos');
    }

    const errors = await validate(createGoalDto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints).join(', '))
        .join('; ');
      throw new HttpException(`Erro: ${errorMessages}`, HttpStatus.BAD_REQUEST);
    }

    return createGoalDto;
  }

  async transformAndValidateUpdateGoalDto(
    data: string,
  ): Promise<UpdateGoalDto> {
    let updateGoalDto: UpdateGoalDto;
    try {
      const parsedData = JSON.parse(data);
      updateGoalDto = plainToInstance(UpdateGoalDto, parsedData);
    } catch (error) {
      throw new BadRequestException('Dados JSON inválidos');
    }

    const errors = await validate(updateGoalDto);
    if (errors.length > 0) {
      const errorMessages = errors
        .map((err) => Object.values(err.constraints).join(', '))
        .join('; ');
      throw new HttpException(`Erro: ${errorMessages}`, HttpStatus.BAD_REQUEST);
    }

    return updateGoalDto;
  }
}
