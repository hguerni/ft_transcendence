import {Body, Controller, Get, Post, Put, Req, Res, UnauthorizedException, UseGuards} from '@nestjs/common';
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { UpdateUserDTO, RegisterDTO} from "../models/user.model";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private authService: AuthService
    ) {}

    @UseGuards(AuthGuard('intra'))
    @Get('auth/login')
    async login(@Req() req, @Res({passthrough: true}) response: Response) {
        response.cookie('clientID', req.user, {httpOnly: true});
        console.log(req.data);
        const client = await this.jwtService.verifyAsync(req.user);

        const clientData = await this.userService.findById(client['id']);

        if(!clientData)
            return response.redirect('http://localhost:3000/register')
        else
            await this.userService.setOnline(client['id']);
        return response.redirect('http://localhost:3000/profile')
    }

    @Post('register')
    async register(@Body() data: RegisterDTO, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        await this.authService.newUser(data, clientID);
    }

    @Put('update')
    async update(@Body() data: UpdateUserDTO, @Req() request: Request) {
        await this.authService.updateUser(data);
    }

    @Get('userData')
    async getUserData(@Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        return await this.userService.getById(clientID);
    }

    @Post('publicUserData')
    async getPublicUserData(@Req() request: Request, @Body() data) {
        return await this.userService.getById(data.id);
    }

    @Post('logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        response.clearCookie('clientID');
        const clientID = await this.authService.clientID(request);
        await this.userService.setOffline(clientID);

        return {message: 'Success'}
    }

}