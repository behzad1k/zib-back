import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne, JoinColumn, OneToMany,JoinTable
} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Attribute } from "./Attribute";
import { Order } from "./Order";
import {User} from "./User";
import {Like} from "./Like";

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

  @Column()
  price: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Attribute, (attribute) => attribute.service)
  attributes: Attribute[]

  @OneToMany(() => Order, (order) => order.service)
  orders: Order[]
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
