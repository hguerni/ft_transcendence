import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepository, Repository } from 'typeorm';
import { UpdateUserDTO, RegisterDTO } from '../models/user.model';
import { FilesService } from './file.service';

@Injectable()
export class UserService {
  getById(id: number) {
    return this.userRepo.findOne(id);
  }
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly filesService: FilesService,
  ) {}

  // async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
  //   const avatar = await this.filesService.uploadFile(imageBuffer, filename);
  //   const user = await this.findByFtId(userId);
  //   await this.userRepo.update(user.id, {
  //     avatarId: avatar.id
  //   });
  //   return avatar;
  // }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepo.find();
  }

  async findByUsername(login: string): Promise<UserEntity> {
    return await this.userRepo.findOne({ where: { login } });
  }

  async findByFtId(ft_id: number): Promise<UserEntity> {
    return await this.userRepo.findOne({where: { ft_id }});
  }

  async updateUser(data: UpdateUserDTO) {
    return await this.userRepo.update(data.id, data);
  }

  async updateAvatar(data: UserEntity) {
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