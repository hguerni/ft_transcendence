import {  BaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	JoinTable,
	ManyToMany,
	OneToMany,
	ManyToOne,
	Entity,
    OneToOne,
    JoinColumn} from 'typeorm';
  import { IsBoolean, IsEmail, isString, IsString } from 'class-validator';
  import { UserEntity } from './user.entity';
import { MemberEntity } from './member.entity';
import { ChatEntity } from './chat.entity';

  @Entity('message')
  export class MsgEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => MemberEntity)
  member: MemberEntity;

  @Column()
  @IsString()
  message: string;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  chat: ChatEntity

  }
