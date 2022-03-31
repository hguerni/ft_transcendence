import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'
import { AuthController } from '../controllers/auth.controller';
import { UserModule } from "./user.module";
import { AuthService } from "../services/auth.service";
import { IntraConfig } from "../config/config.auth";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule} from "@nestjs/passport";
import { jwtConstants } from "../models/user.model";

@Module({
    imports: [
        UserModule,
        HttpModule,
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, IntraConfig],
    exports: [AuthService],
})
export class AuthModule {}