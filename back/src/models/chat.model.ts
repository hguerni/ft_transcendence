import { isNumber, IsNumber, IsString } from "class-validator";

export class ChatDTO {
    @IsString()
    name: string;

    @IsNumber()
    status: number;

    @IsString()
    password: string
<<<<<<< Updated upstream
=======
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
}

export class MsgDTO {
    @IsString()
    message: string;

    @IsNumber()
    chatId: number;
<<<<<<< Updated upstream
=======

    @IsNumber()
    userId: number;
}

export class AddMemberDTO {
    @IsNumber()
    userId: string;

    @IsNumber()
    chatId: number;
>>>>>>> Stashed changes
>>>>>>> Stashed changes
}