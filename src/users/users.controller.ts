import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
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

    return this.usersService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const IdNumber = Number(id);

    if (isNaN(IdNumber)) {
      throw new HttpException('Id inválido', HttpStatus.BAD_REQUEST);
    }

    return this.usersService.findOne(IdNumber);
  }
}
