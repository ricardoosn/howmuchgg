import { ApiProperty } from '@nestjs/swagger';

import { GameMetricsDto } from './game-metrics.dto';
import { GameResponseDto } from './game-response.dto';

export class GameWithMetricsDto extends GameResponseDto {
  @ApiProperty({ type: GameMetricsDto })
  public community!: GameMetricsDto;
}
