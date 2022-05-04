import {  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinTable,
  JoinColumn,
  OneToOne,
  ManyToMany,
  Entity} from 'typeorm';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import File from './file.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
@PrimaryGeneratedColumn()
id: number;

@Column({ unique: true })
ft_id: number;

@CreateDateColumn()
created: Date;

@UpdateDateColumn()
updated: Date;

@Column({ unique: true })
@IsEmail()
@IsString()
email: string;

@Column()
@IsString()
avatar: string;

@Column({unique: true})
@IsString()
login: string;

@Column()
@IsString()
username: string;

@ManyToMany(() => UserEntity)
@JoinTable()
friends: UserEntity[];

@Column({default: false})
@IsBoolean()
isBan: boolean;

@IsBoolean()
online: boolean;

}