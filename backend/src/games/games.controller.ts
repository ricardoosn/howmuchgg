import { Controller, Get, Param, ParseIntPipe, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { GamesService } from './games.service';
import { GameWithMetricsDto } from './dto/game-with-metrics.dto';
import { SubmitPriceDto } from '../prices/dto/submit-price.dto';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { SubmitPriceResponseDto } from '../prices/dto/submit-price-response.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @ApiOperation({ summary: 'List all games with community metrics' })
  @ApiOkResponse({ type: GameWithMetricsDto, isArray: true })
  @Get()
  public async listGames(): Promise<GameWithMetricsDto[]> {
    const games = await this.gamesService.findAll();
    const results: GameWithMetricsDto[] = [];
    for (const game of games) {
      const metrics = await this.gamesService.getMetrics(game.id);
      results.push({
        id: game.id,
        steamAppId: game.steamAppId,
        name: game.name,
        price: game.price,
        currency: game.currency,
        metadata: game.metadata ?? undefined,
        playerPeak: game.playerPeak,
        community: metrics,
      });
    }
    return results;
  }

  @ApiOperation({ summary: 'Get game details with community metrics' })
  @ApiOkResponse({ type: GameWithMetricsDto })
  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  public async getGame(@Param('id', ParseIntPipe) id: number): Promise<GameWithMetricsDto> {
    const game = await this.gamesService.findOneById(id);
    const metrics = await this.gamesService.getMetrics(game.id);
    return {
      id: game.id,
      steamAppId: game.steamAppId,
      name: game.name,
      price: game.price,
      currency: game.currency,
      metadata: game.metadata ?? undefined,
      playerPeak: game.playerPeak,
      community: metrics,
    };
  }

  @ApiOperation({ summary: 'Submit perceived price for a game' })
  @ApiOkResponse({ type: SubmitPriceResponseDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCookieAuth('connect.sid')
  @ApiParam({ name: 'id', type: Number })
  @Post(':id/submit')
  @UseGuards(AuthGuard('jwt-session'))
  public async submitPrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SubmitPriceDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<SubmitPriceResponseDto> {
    if (!request.user) {
      throw new Error('Authenticated user not found in request');
    }
    await this.gamesService.submitPrice(request.user.id, id, body.price);
    return { ok: true };
  }
}
