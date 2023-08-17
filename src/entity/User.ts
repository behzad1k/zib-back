import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn, ManyToMany, JoinTable, IsNull
} from "typeorm";
import { Length, IsNotEmpty, IsEmail } from "class-validator";
import * as bcrypt from "bcryptjs";
import { Address } from "./Address";
import { Order } from "./Order";
import { Service } from "./Service";
import { Like } from "./Like";

@Entity()
// @Unique(["email","username"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phoneNumber: string;

  @Column({
    nullable: true
  })
  name: string

  @Column({
    nullable: true
  })
  @Length(4, 100)
  lastName: string;
  @Column({
    nullable: true
  })
  @Length(4, 8)
  tmpCode: string;

  @Column()
  @Length(4, 100)
  @IsNotEmpty()
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;


  @OneToMany(() => Address , address => address.user, { eager: true })
  addresses: Address[];

  @OneToMany(() => Order, order => order.user)
  orders: Order[]

  @OneToMany(() => Order, order => order.worker, { nullable: true})
  jobs: Order[]
  //
  // @ManyToMany(() => Service,(tweak) => tweak.likes)
  // @JoinTable({name:'like'})
  // likedTweaks : Service[];

  // eslint-disable-next-line @typescript-eslint/require-await
  hashPassword = async (): Promise<void> => {
    this.password = bcrypt.hashSync(this.password, 10);
  };
  generatePassword = () => {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): boolean {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
