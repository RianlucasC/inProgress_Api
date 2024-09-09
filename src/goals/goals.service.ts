import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ICreateGoal } from './types/ICreateGoal';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class GoalsService {
  constructor(
    private usersService: UsersService,
    @InjectRepository(Goal) private goalRepository: Repository<Goal>,
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
}
