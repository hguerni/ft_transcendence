import { Module } from '@nestjs/common';
import { GameGateway } from '../websockets/game.gateway';
import { GameService } from '../services/game.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [],
  providers: [GameGateway, GameService],
})
export class GameModule {}
