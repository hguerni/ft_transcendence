import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import { UserService } from '../services/user.service';
import {JwtModule} from "@nestjs/jwt";
import {jwtConstants} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import { FriendEntity } from '../entities/friend.entity';
import { GameEntity } from '../entities/game.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, FriendEntity, GameEntity]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1d' },
        }),],
    controllers: [UserController],
    providers: [UserService, AuthService],
    exports: [UserService, TypeOrmModule.forFeature([UserEntity, FriendEntity, GameEntity])],
})
export class UserModule {}
