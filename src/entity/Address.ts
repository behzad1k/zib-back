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
import {User} from "./User";
import {Like} from "./Like";

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Length(3, 100)
  title: string;

  @Column()
  userId: number;

  @Column()
  @Length(3, 100)
  description: string;

  @Column()
  phoneNumber: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name:"userId", referencedColumnName: "id"})
  user: User

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
