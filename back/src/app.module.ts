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
import { ChatService } from "./services/chat.service";
import { ChatDTO } from "./models/chat.model";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    GameModule,
    TypeOrmModule.forFeature([ChatEntity])
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService],
})
export class AppModule {}
