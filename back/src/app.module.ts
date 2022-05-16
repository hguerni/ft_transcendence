import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user.module";
import { AuthModule } from "./modules/auth.module";
import { GameModule } from "./modules/game.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "./config/config.service";
import { ChatModule } from "./modules/chat.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    GameModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
