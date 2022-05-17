import {  BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToOne} from 'typeorm';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { UserEntity } from './user.entity';

  @Entity('game')
  export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  endGameTime: Date;

  //@Column()
  @ManyToOne(() => UserEntity)
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
