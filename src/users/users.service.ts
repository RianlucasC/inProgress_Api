import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  create({
    username,
    email,
    password,
    avatar_url,
    auth_provider,
  }: CreateUserDto) {
    const user = this.userRepository.create({
      username,
      email,
      password,
      avatar_url,
      auth_provider,
    });

    return this.userRepository.save(user);
  }

  async findAll(page = 1, limit = 10) {
    const users = await this.userRepository.find({
      select: {
        id: true,
        username: true,
        avatar_url: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { goals: true },
      select: {
        id: true,
        username: true,
        avatar_url: true,
        banner_url: true,
        description: true,
        goals: true,
      },
    });
    return user;
  }

  update(id: number, updateUserDto: Partial<User>) {
    return this.userRepository.update({ id }, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
