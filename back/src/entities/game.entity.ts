import {  BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    Column,
    Entity,
    ManyToOne,
    JoinColumn} from 'typeorm';
import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { UserEntity } from './user.entity';

  @Entity('game')
  export class GameEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  endGameTime: Date;

  @ManyToOne(() => UserEntity, user => user.advgames)
  adversary: UserEntity;

  @Column()
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
