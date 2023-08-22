import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({name: 'userId', referencedColumnName: 'id'})
  user: User

  @ManyToOne(() => Service, (service) => service.orders, { nullable: true} )
  @JoinColumn({name: 'attributeId', referencedColumnName: 'id'})
  attribute: Service

  @ManyToOne(() => Service, (service) => service.orders)
  @JoinColumn({name: 'serviceId', referencedColumnName: 'id'})
  service: Service

  @ManyToOne(() => User, (user) => user.jobs, {
    nullable: true,
  })
  @JoinColumn({name: 'workerId', referencedColumnName: 'id'})
  worker?: User
}