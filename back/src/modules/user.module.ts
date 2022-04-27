import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import { UserService } from '../services/user.service';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import { FilesService } from '../services/file.service';
import File from 'src/entities/file.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, File]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),],
    controllers: [UserController],
    providers: [UserService, AuthService, FilesService],
    exports: [UserService],
})
export class UserModule {}