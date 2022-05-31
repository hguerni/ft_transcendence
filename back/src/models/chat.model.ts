import { isNumber, IsNumber, IsString } from "class-validator";

export class ChatDTO {
    @IsString()
    name: string;

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

    @IsNumber()
    id: number;
}

export class AddMemberDTO {
    @IsString()
    channel: string;

    @IsNumber()
    id: number;

    @IsNumber()
    status: number;
}
