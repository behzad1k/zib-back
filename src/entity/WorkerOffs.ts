import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './Order';
import { User } from './User';

@Entity()
export class WorkerOffs {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  time: number

  @Column()
  date: Date

  @Column({
    nullable: true
  })
  orderId: number

  @Column()
  workerId: number

  @ManyToOne(() => User, user => user.workerOffs)
  @JoinColumn({ name: 'workerId', referencedColumnName: 'id'})
  worker: User

  @ManyToOne(() => Order, order => order.worker)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id'})
  order: Order
}