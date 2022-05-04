
import {Body, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./user.service";
import {UpdateUserDTO, RegisterDTO} from "../models/user.model";
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) {}
  

    async clientID(request: Request): Promise<number> {
        const cookie = request.cookies['clientID'];
        const data = await this.jwtService.verifyAsync(cookie);

        return data['id'];
    }

    async newUser(@Body() data: RegisterDTO, clientID: number) {
        data.id = clientID;
        data.authentication = false;

        await this.userService.createUser(data);
    }

    async updateUser(@Body() data: UpdateUserDTO) {
        await this.userService.updateUser(data);
    }

    async updateAvatar(@Body() data: UserEntity) {
        await this.userService.updateAvatar(data);
    }
}