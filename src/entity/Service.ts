import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable
} from 'typeorm';
import { Length } from "class-validator";
import { Order } from "./Order";
import { User } from "./User";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  @Length(3, 100)
  description: string;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  price: number;

  @Column()
  sections: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.service)
  orders: Order[]

  @OneToMany(() => Service , service => service.parent)
  attributes: Service[];

  @ManyToOne(() => Service, service => service.attributes)
  @JoinColumn({name: 'parentId', referencedColumnName: 'id'})
  parent: Service

  @OneToMany(() => User, user => user.service)
  users: Service

  @ManyToMany(() => Order, order => order.attributes)
  @JoinTable({
    name: 'order_attribute'
  })
  attributeOrders: Order[]

  // @ManyToMany(() => User,(user) => user.likedTweaks)
  // @JoinTable({
  //   name: "like",
  // })
  // likes : User[];

  // @ManyToOne((type) => Service,(tweak) => tweak.children  )
  // @JoinColumn({ name:"parentId", referencedColumnName: "id"})
  // parent: Service;
  //
  // @OneToMany((type) => Service,(tweak) => tweak.parent  )
  // @JoinColumn({ name:"parentId", referencedColumnName: "id"})
  // children: Service;
  //
  // @ManyToOne(type => User,user => user.tweaks)
  // @JoinColumn({name:'userId', referencedColumnName: "id" })
  // user: User;
}
