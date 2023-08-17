import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne, JoinColumn
} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
import { User } from "./User";
import { Service } from "./Service";

@Entity()
export class Like {
  //TODO:FIX MIGRATIONS FOR THE ERROR
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // @IsNotEmpty()
  // tweakId: number;
  //
  // @Column()
  // @IsNotEmpty()
  // userId: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => User, user => user.id, { primary: true })
  // @JoinColumn()
  // user: User
  //
  // @ManyToOne(() => Service, tweak => tweak.id, { primary: true })
  // @JoinColumn()
  // tweak: Service


}
