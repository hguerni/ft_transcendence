import { IsNumber, IsString } from "class-validator";

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
}