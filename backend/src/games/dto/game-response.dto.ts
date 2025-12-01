import { ApiProperty } from '@nestjs/swagger';

export class GameResponseDto {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public steamAppId!: number;

  @ApiProperty()
  public name!: string;

  @ApiProperty()
  public price!: number;

  @ApiProperty()
  public currency!: string;

  @ApiProperty({ required: false, type: 'object', additionalProperties: true })
  public metadata?: Record<string, unknown>;

  @ApiProperty()
  public playerPeak!: number;
}
