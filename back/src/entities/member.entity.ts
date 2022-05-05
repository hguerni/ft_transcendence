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
    PrimaryColumn} from 'typeorm';
  import { IsBoolean, IsEmail, IsString } from 'class-validator';
  import { UserEntity } from './user.entity';
  import { ChatEntity } from './chat.entity';

  @Entity('member')
  export class MemberEntity extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  status: number;

  @Column()
  @IsBoolean()
  mute: boolean;

<<<<<<< Updated upstream
  // @OneToMany(() => ChatEntity, (chat) => chat.members )
  // chat: ChatEntity;
=======
<<<<<<< Updated upstream
  @OneToMany(() => ChatEntity, (chat) => chat.members )
  chat: ChatEntity;
>>>>>>> Stashed changes

=======
>>>>>>> Stashed changes
  }