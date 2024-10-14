import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('conferences')
export class Conference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventName: string;

  @Column('simple-array')
  speakers: string[];

  @Column()
  location: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  time: string;

  @Column('simple-array', { nullable: true })
  image: string;

  @Column('text')
  body: string;

  @Column('simple-array', { nullable: true })
  eventImages: string[];

  @Column({ nullable: true })
  eventImageDesc: string;

  @CreateDateColumn()
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
