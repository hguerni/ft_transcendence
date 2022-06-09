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
import { isBoolean, IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
import File from './file.entity';
import { FriendEntity } from './friend.entity';
import { MemberEntity } from './member.entity';
import { GameEntity } from './game.entity';

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

@OneToMany(() => FriendEntity, friend => friend.friend)
donotuse: FriendEntity[];

@OneToMany(() => GameEntity, games => games.user)
games: GameEntity[];

@OneToMany(() => GameEntity, games => games.adversary)
advgames: GameEntity[];

@Column({default: false})
@IsBoolean()
isBan: boolean;

@Column({ nullable: true })
@IsNumber()
online: number;

@Column()
@IsBoolean()
twofa: boolean;

@Column({ nullable: true })
twofaSecret?: string;
}