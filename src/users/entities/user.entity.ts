import { Goal } from 'src/goals/entities/goal.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, length: 30 })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ nullable: true })
  banner_url: string;

  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role: string;

  @Column({ type: 'enum', enum: ['LOCAL', 'GOOGLE'], default: 'LOCAL' })
  auth_provider: string;

  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];

  @CreateDateColumn()
  createdAt: Date;
}
