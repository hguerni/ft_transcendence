import {  BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Column,
    JoinTable,
    JoinColumn,
    OneToOne,
    ManyToMany,
    Entity} from 'typeorm';
  import { IsBoolean, IsEmail, IsString } from 'class-validator';
  import { UserEntity } from './user.entity';
  
  @Entity('users')
  export class FriendEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @IsString()
  status: string;
  
  @OneToOne(() => UserEntity)
  @JoinTable()
  playerone: UserEntity;
  
  @OneToOne(() => UserEntity)
  @JoinTable()
  playertwo: UserEntity;

}