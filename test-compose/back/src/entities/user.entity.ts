
import {  BaseEntity,
          CreateDateColumn,
          PrimaryGeneratedColumn,
          UpdateDateColumn,
          Column,
          Entity} from 'typeorm';
import { IsBoolean, IsEmail, IsString } from 'class-validator';

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column({ unique: true })
  @IsEmail()
  @IsString()
  email: string;

  @Column({unique: true})
  @IsString()
  login: string;

  @Column()
  @IsString()
  username: string;

  @Column({ default: null, nullable: true })
  image: string | null;

  @Column({default: false})
  @IsBoolean()
  isBan: boolean;
}