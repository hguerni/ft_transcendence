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
  OneToOne} from 'typeorm';
  import { IsBoolean, IsEmail, IsString } from 'class-validator';
  import { MemberEntity } from './member.entity';
import { MsgEntity } from './msg.entity';

  enum status {
    private,
    public,
    protected
  }

  @Entity('chat')
  export class ChatEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @Column()
  @IsString()
  name: string;

  @Column()
  status: number;

  @Column()
  @IsString()
  password: string;

  @ManyToOne(() => MemberEntity, (members) => members.chat)
  @JoinTable()
  members: MemberEntity[];

  @OneToMany(() => MsgEntity, (message) => message.chat)
  messages: MsgEntity[]

  }