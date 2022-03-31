
import {Body, Injectable} from '@nestjs/common';
import {Request} from 'express';
import {JwtService} from "@nestjs/jwt";
import {UserService} from "./user.service";
import {UpdateUserDTO, RegisterDTO} from "../models/user.model";

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
        data.image = 'https://previews.123rf.com/images/koblizeek/koblizeek2001/koblizeek200100050/138262629-man-icon-profile-member-user-perconal-symbol-vector-on-white-isolated-background-.jpg?fj=1';
        data.id = clientID;
        data.authentication = false;

        await this.userService.createUser(data);
    }

    async updateUser(@Body() data: UpdateUserDTO) {
        await this.userService.updateUser(data);
    }
}