import {  BaseEntity,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	Column,
	JoinTable,
	ManyToMany,
	OneToMany,
	ManyToOne,
	Entity} from 'typeorm';
  import { IsBoolean, IsEmail, IsString } from 'class-validator';
  import { UserEntity } from './user.entity';

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
  @IsBoolean()
  private: boolean;

  @Column()
  @IsString()
  password: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @ManyToOne(() => UserEntity)
  bans: UserEntity[];

  @ManyToOne(() => UserEntity)
  modos: UserEntity[];

  }