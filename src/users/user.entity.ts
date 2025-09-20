import { Company } from 'src/companies/company.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  role: number;

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column()
  createDate: string;

  @Column({ default: true })
  active: boolean;

  @Column()
  phone: string;

  @Column({ nullable: false })
  cedula: number;

  @Column()
  serverDate: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  tokenfirebase: string;
}
