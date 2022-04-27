import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import File from '../entities/file.entity';
 
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private FilesRepository: Repository<File>,
  ) {}
 
  async uploadFile(dataBuffer: Buffer, filename: string) {
    const newFile = await this.FilesRepository.create({
      filename,
      data: dataBuffer
    })
    await this.FilesRepository.save(newFile);
    return newFile;
  }
 
  async getFileById(fileId: number) {
    const file = await this.FilesRepository.findOne(fileId);
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
}