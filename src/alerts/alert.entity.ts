import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  iduser: number;

  @Column()
  companyId: number;

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  latitude: string;

  @Column({ nullable: false })
  longitude: string;

  @Column()
  message: string;

  @Column({ type: 'timestamp with time zone', nullable: false })
  serverDate: string;

  @Column()
  status: number;
}
