import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne, JoinColumn, OneToMany
} from "typeorm";
import { Length } from "class-validator";
import { Order } from "./Order";

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(3, 100)
  title: string;

  @Column()
  @Length(3, 100)
  slug: string;

  @Column()
  @Length(3, 100)
  description: string;

  @Column({
    nullable: true
  })
  parentId: string;

  @Column()
  price: number;

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
