import { RolesEnum } from '../../auth/dto/roles.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  membershipId: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'enum', enum: RolesEnum })
  roles: RolesEnum[];

  @Column()
  title: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  gender: string;

  @Column()
  affiliation: string;

  @Column()
  dateOfBirth: string;

  @Column()
  jobTitle: string;

  @Column()
  highestDegree: string;

  @Column()
  careerStatus: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
