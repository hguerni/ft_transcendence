import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user.module";
import { AuthModule } from "./modules/auth.module";
import { GameModule } from "./modules/game.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "./config/config.service";
import { ChatGateway } from "./websockets/chat.gateway";
import { ChatEntity } from "./entities/chat.entity";
import { MsgEntity } from "./entities/msg.entity";
import { ChatService } from "./services/chat.service";
import { ChatDTO } from "./models/chat.model";
<<<<<<< Updated upstream
import { MsgDTO } from "./models/chat.model";
=======
<<<<<<< Updated upstream
=======
import { MsgDTO } from "./models/chat.model";
import { MemberEntity } from "./entities/member.entity";
import { UserEntity } from "./entities/user.entity";
>>>>>>> Stashed changes
>>>>>>> Stashed changes

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
<<<<<<< Updated upstream
    TypeOrmModule.forFeature([ChatEntity, MsgEntity]),
=======
<<<<<<< Updated upstream
=======
    TypeOrmModule.forFeature([ChatEntity, MsgEntity, MemberEntity, UserEntity]),
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService],
})
export class AppModule {}
