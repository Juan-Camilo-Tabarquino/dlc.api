import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  createDate: string;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'bigint' })
  nit: string;

  @Column()
  adress: string;

  @Column('text', {
    array: true,
    nullable: false,
    default: () => `{"06:00:00", "18:00:00"}`,
  })
  monitoringTime: string[];

  @Column()
  serverDate: string;

  @Column({ nullable: true })
  logo: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}
