import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';

export class SubmitPriceDto {
  @ApiProperty({ minimum: 0, maximum: 500, example: 2499 })
  @IsInt()
  @Min(0)
  @Max(500)
  public price!: number;
}
