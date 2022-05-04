import {  BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Column,
    JoinTable,
    JoinColumn,
    OneToOne,
    ManyToOne,
    ManyToMany,
    Entity} from 'typeorm';
  import { IsBoolean, IsEmail, IsString } from 'class-validator';
  import { UserEntity } from './user.entity';
  
  @Entity('friends')
  export class FriendEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @IsString()
  status: string;
  
  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity;
}