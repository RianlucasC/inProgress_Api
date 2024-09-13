import { PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-goal.dto';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

enum GoalStatus {
  COMPLETE = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE',
}

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @IsOptional()
  @IsString({ message: 'O título deve ser uma string.' })
  @Length(10, 50, { message: 'O título deve ter entre 10 e 50 caracteres.' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string.' })
  description?: string;

  @IsOptional()
  @IsEnum(GoalStatus, { message: 'Status deve ser COMPLETED ou INCOMPLETE' })
  status?: 'COMPLETED' | 'INCOMPLETE';
}
