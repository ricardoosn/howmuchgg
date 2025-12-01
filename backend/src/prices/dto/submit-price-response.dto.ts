import { ApiProperty } from '@nestjs/swagger';

export class SubmitPriceResponseDto {
  @ApiProperty({ example: true })
  public ok!: boolean;
}
