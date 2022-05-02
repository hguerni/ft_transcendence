import { Module } from '@nestjs/common';
import { GameGateway } from '../websockets/game.gateway';
import { GameService } from '../services/game.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GameGateway, GameService],
})
export class GameModule {}
