import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Food extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude()
  @Generated('uuid')
  uuid: string;

  @Expose()
  @Column()
  @ApiProperty(
    {
      description: 'Name',
      type: String
    }
  )
  name: String;

  @Expose()
  @Column()
  @ApiProperty(
    {
      description: 'Calories',
      type: Number
    }
  )
  calorieValue: Number;

  @Expose()
  @Column({
    default:0,
    type:Number
  })
  @ApiProperty(
    {
      description: 'Price',
      type: Number
    }
  )
  price: Number;

  @Expose()
  @Column({
    type: 'datetime'
  })
  @ApiProperty(
    {
      description: 'Taken Date Time',
      type: Date
    }
  )
  takenDateTime: Date;

  @CreateDateColumn({
    type: 'datetime'
  })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'datetime'
  })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'datetime',
    default: null
  })
  @Exclude()
  deletedAt: Date;

  @Expose()
  @Column()
  userId: Number;

  @Expose()
  @ManyToOne(() => User, (user) => user.foods, { eager: true })
  @JoinColumn()
  @ApiProperty(
    {
      description: 'User Id',
      type: User
    }
  )
  user: User;

  @VersionColumn()
  @Exclude()
  version: string;
}
