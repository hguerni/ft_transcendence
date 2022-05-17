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
    Entity,
    ManyToOne} from 'typeorm';
  import { isBoolean, IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';
  import { MemberEntity } from './member.entity';
import { UserEntity } from './user.entity';
  
  @Entity('game')
  export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @CreateDateColumn()
  endGameTime: Date;
  
  @Column()
  adversary: UserEntity;
  
  @IsString()
  gameName: string;
  
  @ManyToOne(() => UserEntity, user => user.games)
  user: UserEntity;

  @Column()
  @IsNumber()
  winner: boolean;
  
  @Column()
  @IsBoolean()
  userscore: number;

  @Column()
  @IsNumber()
  adversaryscore: number;
  
  }