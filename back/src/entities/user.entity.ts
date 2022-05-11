import {  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinTable,
  JoinColumn,
  OneToOne,
  ManyToMany,
  OneToMany,
  Entity} from 'typeorm';
import { isBoolean, IsBoolean, IsEmail, IsString } from 'class-validator';
import File from './file.entity';
import { FriendEntity } from './friend.entity';
import { MemberEntity } from './member.entity';

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

@OneToMany(() => FriendEntity, friend => friend.user)
friends: FriendEntity[];

@Column({default: false})
@IsBoolean()
isBan: boolean;


online: number;

@Column()
@IsBoolean()
twofa: boolean;

@Column({ nullable: true })
twofaSecret?: string;
}