import { IsString, Length } from 'class-validator';

export class CreateGoalDto {
  @IsString({ message: 'O título deve ser uma string.' })
  @Length(10, 50, { message: 'O título deve ter entre 10 e 50 caracteres.' })
  title: string;

  @IsString({ message: 'A descrição deve ser uma string.' })
  description: string;
}
