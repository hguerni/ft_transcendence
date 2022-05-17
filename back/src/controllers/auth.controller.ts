import {Body, Controller, Get, Param, Post, Put, Req, Res, UnauthorizedException, ParseIntPipe, UseGuards} from '@nestjs/common';
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
        const client = await this.jwtService.verifyAsync(req.user);

        const clientData = await this.userService.findByFtId(client['id']);

        if(!clientData)
            return response.redirect('http://localhost:3000/')
        if(clientData.twofa)
            return response.redirect('http://localhost:3000/2fa')
        return response.redirect('http://localhost:3000/profile')
    }

    @Post('register')
    async register(@Body() data: RegisterDTO, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        await this.authService.newUser(data, clientID);
    }

    @Get('2fa/activate')
    async activate2fa(@Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        const OtpAuthUrl = await this.authService.twoFactorAuthSecret(clientID);
        return this.authService.createQRcode(OtpAuthUrl);
    }

    @Post('2fa/verify')
    async verify2fa (@Req() request: Request, @Body() data) {
        const clientID = await this.authService.clientID(request);
        const validated = await this.authService.twoFactorAuthVerify(data.code, clientID);
        console.log(validated);
        console.log("LOL");

        if (!validated)
            throw new UnauthorizedException('Wrong authentication code');
        else
            await this.userService.enableTwoFactor(clientID);

        return true;
    }

    @Post('2fa/login')
    async login2fa (@Req() request: Request, @Body() data) {
        const clientID = await this.authService.clientID(request);
        const validated = await this.authService.twoFactorAuthVerify(data.code, clientID);

        if (!validated)
            throw new UnauthorizedException('Wrong authentication code');
    }

    @Get('2fa/disable')
    async disable2fa (@Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        await this.userService.disableTwoFactor(clientID);

        return true;
    }

    @Put('update')
    async update(@Body() data: UpdateUserDTO, @Req() request: Request) {
        await this.authService.updateUser(data);
    }

    @Put('updateAvatar')
    async updateAvatar(@Body() data: any, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        const clientData = await this.userService.findByFtId(clientID);
        clientData.avatar = data.avatar;
        await this.authService.updateAvatar(clientData);
    }

    @Get("addfriend/:id")
    async addFriend(@Param('id', new ParseIntPipe()) id, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        return await this.userService.addFriend(clientID, id)
    }

    @Get("removefriend/:id")
    async removeFriend(@Param('id', new ParseIntPipe()) id, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        return await this.userService.removeFriend(clientID, id)
    }

    @Get("block/:id")
    async block(@Param('id', new ParseIntPipe()) id, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        return await this.userService.block(clientID, id)
    }

    @Get('userData')
    async getUserData(@Req() request: Request) {
        console.log(request.cookies)
        const clientID = await this.authService.clientID(request);
        console.log(clientID);
        return await this.userService.findByFtId(clientID);
    }

    @Get('userModel')
    async getUserModel(@Req() request: Request) {
        //console.log(request.cookies)
        try {
            const clientID = await this.authService.clientID(request);
            //console.log(clientID);
            const user = await this.userService.findByFtId(clientID);
            let usermodel = {id: 0, username: '', online: 0, email: '', avatar: '', twofa: false}
            usermodel.id = user.ft_id;
            usermodel.username = user.username;
            usermodel.online = user.online;
            usermodel.email = user.email
            usermodel.avatar = user.avatar;
            usermodel.twofa = user.twofa;
            return usermodel;
        }
        catch (err) {
            return null;
        }
    }

    @Get('userID')
    async getUserID(@Req() request: Request) {
        console.log(request.cookies)
        const clientID = await this.authService.clientID(request);
        console.log(clientID);
        return clientID;
    }

    @Post('publicUserData')
    async getPublicUserData(@Req() request: Request, @Body() data) {
        return await this.userService.getById(data.id);
    }

    @Get("friends")
    async getFriends(@Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        return await this.userService.getFriends(clientID);
    }

    @Get('logout')
    async logout(@Req() request: Request, @Res({passthrough: true}) response: Response) {
        response.clearCookie('clientID');
        //const clientID = await this.authService.clientID(request);
        //await this.userService.setOffline(clientID);

        return {message: 'Success'}

    }

    @Put("EndGame")
    async endGame(@Body() data: any, @Req() request: Request) {
        const clientID = await this.authService.clientID(request);
        return await this.userService.saveGame(clientID, data);
    }

    @Get('uploads/:path')
    async getImage(@Param('path') path, @Res() res: Response) {
        res.sendFile(path, {root: 'uploads'});
    }
}
