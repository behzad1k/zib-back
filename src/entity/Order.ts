import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Address } from "./Address";
import { Service } from "./Service";
import { User } from "./User";

@Entity()

export class Order {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  price: number

  @Column({
    nullable: true
  })
  discount?: number

  @Column({
    default: 0
  })
  transportation?: number

  @Column({
    nullable: true
  })
  userId?: number

  @Column()
  serviceId?: number

  @Column()
  status: string

  @Column({
    nullable: true
  })
  workerId: number

  @Column({
    nullable: true
  })
  attributeId: number

  @Column()
  addressId: number

  @Column()
  date: number

  @Column()
  time: string

  @Column({
    default: true
  })
  inCart: boolean

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({name: 'userId', referencedColumnName: 'id'})
  user: User

  @ManyToOne(() => Service, (service) => service.orders, { nullable: true} )
  @JoinColumn({name: 'attributeId', referencedColumnName: 'id'})
  attribute: Service

  @ManyToOne(() => Service, (service) => service.orders)
  @JoinColumn({name: 'serviceId', referencedColumnName: 'id'})
  service: Service

  @ManyToOne(() => Address, (address) => address.order)
  @JoinColumn({name: 'addressId', referencedColumnName: 'id'})
  address: Address

  @ManyToOne(() => User, (user) => user.jobs, {
    nullable: true,
  })
  @JoinColumn({name: 'workerId', referencedColumnName: 'id'})
  worker?: User
}