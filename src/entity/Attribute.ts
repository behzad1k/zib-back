import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Service } from "./Service";

@Entity()
export class Attribute{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  serviceId: number

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Service,  (service) => service.attributes)
  @JoinColumn({name: 'serviceId', referencedColumnName: 'id'})
  service: Service;
}