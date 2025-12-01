import { ApiProperty } from '@nestjs/swagger';

export class UserPriceEntryDto {
  @ApiProperty()
  public gameId!: number;

  @ApiProperty()
  public povPrice!: number;
}
