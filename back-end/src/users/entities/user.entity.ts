import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Food } from 'src/food/entities/food.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Exclude()
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, nullable: false })
  @Expose()
  @ApiProperty(
    {
      description: 'Email',
      type: String,
      uniqueItems:true
    }
  )
  email: string;

  @Column()
  @Exclude()
  @ApiProperty(
    {
      description: 'Password',
      type: String
    }
  )
  password: string;

  @Column()
  @ApiProperty(
    {
      description: 'First Name',
      type: String
    }
  )
  firstName: string;

  @Column()
  @ApiProperty(
    {
      description: 'Last Name',
      type: String
    }
  )
  lastName: string;

  @Column()
  @Expose()
  @ApiProperty(
    {
      description: 'Role',
      type: String
    }
  )
  role: string;

  @OneToMany(() => Food, (food) => food.user)
  @ApiProperty(
    {
      description: 'Foods',
      type: Array<Food>
    }
  )
  foods: Food[];

  @CreateDateColumn({ type: 'datetime' })
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  @Exclude()
  deletedAt: Date;

  @VersionColumn()
  @Exclude()
  version: string;
}
