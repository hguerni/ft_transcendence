import { isNumber, IsNumber, IsString } from "class-validator";

export class ChatDTO {
    @IsString()
    channel: string;

    @IsNumber()
    status: number;

    @IsString()
    password: string;
}

export class MsgDTO {
    @IsString()
    message: string;

    @IsString()
    channel: string;

    @IsString()
    login: string;
}

export class AddMemberDTO {
    @IsString()
    channel: string;

    @IsString()
    login: string;
}
