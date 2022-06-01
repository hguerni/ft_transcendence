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
  
  @Column()
  @IsString()
  status: string;
  
  @ManyToOne(()=> UserEntity, user => user.friends)
  @JoinTable()
  user: UserEntity;

  @ManyToOne(()=> UserEntity, user => user.donotuse)
  @JoinTable()
  friend: UserEntity;

  @OneToOne(() => FriendEntity, {nullable : true})
  @JoinTable()
  friendship: FriendEntity;
}