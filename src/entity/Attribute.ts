import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Order } from "./Order";
import { Service } from "./Service";

@Entity()
export class Attribute{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  slug: string

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

  @OneToMany(() => Order,  (order) => order.attribute)
  orders: Order[];
}