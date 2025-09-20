import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false })
  iduser: string;

  @Column({ nullable: false })
  latitude: string;

  @Column({ nullable: false })
  longitude: string;

  @Column({ type: 'timestamp with time zone', nullable: false })
  date: string;

  @Column({ nullable: false })
  course: string;

  @Column({ type: 'timestamp with time zone', nullable: false })
  serverDate: string;

  @Column({ nullable: false })
  nomenclature: string;

  @Column({ nullable: false })
  speed: string;
}
