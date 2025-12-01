import { ApiProperty } from '@nestjs/swagger';

export class GameMetricsDto {
  @ApiProperty()
  public median!: number;

  @ApiProperty()
  public average!: number;

  @ApiProperty()
  public count!: number;
}
