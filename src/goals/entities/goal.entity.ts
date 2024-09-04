import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => User, (user) => user.goals)
  user: User;

  @Column({ type: 'string', nullable: false })
  title: string;

  @Column({ type: 'string', nullable: false })
  description: string;

  @Column({
    type: 'enum',
    enum: ['COMPLETED', 'INCOMPLETE'],
    default: 'INCOMPLETE',
  })
  status: string;

  @Column({ nullable: true })
  banner_url: string;
}
