import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatController } from "../controllers/chat.controller";
import { ChatEntity } from "../entities/chat.entity";
import { MemberEntity } from "../entities/member.entity";
import { MsgEntity } from "../entities/msg.entity";
import { UserEntity } from "../entities/user.entity";
import { ChatService } from "../services/chat.service";
import { ChatGateway } from "../websockets/chat.gateway";
import { UserModule } from "./user.module";

@Module({
    imports: [
      UserModule,
      TypeOrmModule.forFeature([ChatEntity, MsgEntity, MemberEntity, UserEntity]),
    ],
    controllers: [ChatController],
    providers: [ChatService, ChatGateway],
  })
  export class ChatModule {}