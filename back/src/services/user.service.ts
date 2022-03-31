import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { UpdateUserDTO, RegisterDTO } from '../models/user.model';

@Injectable()
export class UserService {
  getById(userId: number) {
    return this.userRepo.findOne(id);
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
    return await this.userRepo.update(data.id, data);
  }

  async createUser(data: RegisterDTO) {
    return await this.userRepo.save(data);
  }

  async setOffline(clientID: number): Promise<any> {
    return this.userRepo.update(clientID, { online: false });
  }

  async setOnline(clientID: number): Promise<any> {
    return this.userRepo.update(clientID, { online: true });
  }
}