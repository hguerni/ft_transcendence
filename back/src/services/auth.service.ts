
import {Body, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {authenticator} from "otplib";
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
  
    async twoFactorAuthSecret(clientID: number) {
        const client = await this.userService.findByFtId(clientID);
        const secret = authenticator.generateSecret();
        await this.userService.saveTwoFactorSecret(secret, clientID);

        return  authenticator.keyuri(client.email, 'ft_transcendence', secret); //OtpAuthUrl
    }

    async createQRcode(otpauthUrl: string) {
        var QRCode = require('qrcode');
        await QRCode.toFile('./uploads/qrcode.png', otpauthUrl);

        return {url: 'http://localhost:3030/uploads/qrcode.png'};
    }

    async twoFactorAuthVerify(code: string, clientID: number) {
        const client = await this.userService.findByFtId(clientID);

        return authenticator.verify({token: code, secret: client.twofaSecret});
    }

    async clientID(request: Request): Promise<number> {
        const cookie = request.cookies['clientID'];
        const data = await this.jwtService.verifyAsync(cookie);

        return data['id'];
    }

    async newUser(@Body() data: RegisterDTO, clientID: number) {
        data.id = clientID;
        data.twofa = false;

        await this.userService.createUser(data);
    }

    async updateUser(@Body() data: UpdateUserDTO) {
        await this.userService.updateUser(data);
    }

    async updateAvatar(@Body() data: UserEntity) {
        await this.userService.updateAvatar(data);
    }
}