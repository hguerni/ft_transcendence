import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios' ;
import { AuthService } from '../services/auth.service';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { JwtService } from "@nestjs/jwt";
import { lastValueFrom } from 'rxjs';
import { RegisterDTO } from '../models/user.model';
import { UserService } from '../services/user.service';

//APPLICATION DATA
const uid = 'ee2541faed7eb8ad4cf7c3108ce1ef0e80c014ccca2ec59286a4449299ece99d';
const secret = '3986895f74fd6788ceaef23242909a0e454bb11bd5efffca1ce5e67d7d88acca';
const callbackURL = 'http://localhost:3030/auth/login'
const state = 'lololol'


@Injectable()
export class IntraConfig extends PassportStrategy(Strategy, 'intra') {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private http: HttpService,
        private jwtService: JwtService
    ) {
        super({
            authorizationURL: `https://api.intra.42.fr/oauth/authorize?${ stringify({
                client_id     : uid,
                redirect_uri  : callbackURL,
                scope         : 'public',
                state         : state,
                response_type : 'code',
            }) }`,
            tokenURL        : 'https://api.intra.42.fr/oauth/token',
            clientID        : uid,
            clientSecret    : secret,
            callbackURL     : callbackURL,
            scope           : 'public',
        });
    }

    async validate(accessToken: string): Promise<any> {
        const data = await lastValueFrom(this.http.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${ accessToken }` },
        }));
        const jwt = await this.jwtService.signAsync({id: data.data.id});
        const clientData = await this.userService.findByFtId(data.data.id);

        if(!clientData){
            let clientData = new RegisterDTO;
            clientData.login = data.data.login;
            clientData.username = data.data.login;
            clientData.email = data.data.email;
            clientData.ft_id = data.data.id;
            clientData.avatar = "http://localhost:3030/uploads/avatar.png"
            await this.authService.newUser(clientData, data.data.id);
        }
        return jwt;
    }

}