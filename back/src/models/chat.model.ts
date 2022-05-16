import { isNumber, IsNumber, IsString } from "class-validator";

export class ChatDTO {
    @IsString()
    name: string;

    @IsNumber()
    status: number;

    @IsString()
    password: string
}

export class MsgDTO {
    @IsString()
    message: string;

    @IsNumber()
    chatId: number;

    @IsNumber()
    userId: number;
}

export class AddMemberDTO {
    @IsNumber()
    userId: string;

    @IsNumber()
    chatId: number;
}