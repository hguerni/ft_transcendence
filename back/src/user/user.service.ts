import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { UpdateUserDTO } from '../models/user.model';

@Injectable()
export class UserService {
  getById(userId: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepo.find();
  }

  async findByUsername(login: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { login } });
  }

  async findById(id: number): Promise<UserEntity> {
    return await this.userRepo.findOne(id);
  }

  async updateUser(data: UpdateUserDTO) {
    const user = await this.userRepo.findOne(data.userId);
    const users = await getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.username = :username', { username: data.username })
      .getOne();
    if (user.username == data.username)
      return this.userRepo.save({ ...user, ...data });
    if (users != undefined) return false;
    return this.userRepo.save({ ...user, ...data });
  }

  async createUser(username: string, email: string) {
    const repository = getRepository(UserEntity);

    const user = new UserEntity();
    user.username = username;
    user.email = email;
    user.login = username;
    await user.save();
    return user;
  }
}