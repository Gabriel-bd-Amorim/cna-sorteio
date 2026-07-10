import { Controller, Get, Post, Query } from '@nestjs/common';
import { RaffleService } from './raffle.service';

@Controller('raffle')
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  @Get('participants')
  participants() {
    return this.raffleService.participants();
  }

  @Post('draw')
  draw(@Query('allowRepeat') allowRepeat?: string) {
    const onlyNewWinners = allowRepeat !== 'true';
    return this.raffleService.draw(onlyNewWinners);
  }

  @Get('history')
  history() {
    return this.raffleService.history();
  }
}
