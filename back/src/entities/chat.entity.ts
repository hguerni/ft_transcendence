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
  import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
  import { MemberEntity } from './member.entity';
import { MsgEntity } from './msg.entity';

  export enum chat_status {
    private,
    public,
    protected,
    pv_message
  }

  @Entity('chat')
  export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @Column({unique: true})
  @IsString()
  name: string;

  @Column()
  @IsNumber()
  status: number;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => MsgEntity, (message) => message.chat)
  messages: MsgEntity[];

  @OneToMany(() => MemberEntity, (member) => member.chat)
  members: MemberEntity[];

  }
