import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  headerImage: string;

  @Column({ type: 'simple-array', nullable: true })
  image: string[];

  @Column('simple-array')
  tags: string[];

  @Column()
  description: string;

  @Column('text')
  body: string;

  @Column()
  author: string;

  @CreateDateColumn()
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
