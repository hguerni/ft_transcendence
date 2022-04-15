import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./modules/user.module";
import { AuthModule } from "./modules/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { configService } from "./config/config.service";
import { ChatGateway } from "./websocket/chat.getaway";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
