import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user.module";
import { AuthModule } from "./modules/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "./config/config.service";
import { ChatGateway } from "./websocket/chat.getaway";
import { ChatEntity } from "./entities/chat.entity";
import { MsgEntity } from "./entities/msg.entity";
import { ChatService } from "./services/chat.service";
import { ChatDTO } from "./models/chat.model";
import { MsgDTO } from "./models/chat.model";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([ChatEntity, MsgEntity])
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService],
})
export class AppModule {}