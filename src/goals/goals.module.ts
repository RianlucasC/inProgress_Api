import { Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { UploadModule } from 'src/upload/upload.module';
import { UploadService } from 'src/upload/upload.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Goal]), UploadModule],
  controllers: [GoalsController],
  providers: [GoalsService, UploadService],
})
export class GoalsModule {}
