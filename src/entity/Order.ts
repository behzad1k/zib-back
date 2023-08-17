import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()

export class Order{

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  price: number

  @Column()
  discount: number

  @Column()
  userId: number

  @Column()
  status: string

  @Column()
  workerId: number

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({name: 'userId', referencedColumnName: 'id'})
  user: User

  @ManyToOne(() => User, (user) => user.jobs, {
    nullable: true,
    eager: true
  })
  @JoinColumn({name: 'workerId', referencedColumnName: 'id'})
  worker?: User
}