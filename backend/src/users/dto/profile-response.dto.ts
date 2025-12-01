import { ApiProperty } from '@nestjs/swagger';

import { UserPriceEntryDto } from './user-price-entry.dto';

export class ProfileResponseDto {
  @ApiProperty()
  public id!: number;

  @ApiProperty()
  public username!: string;

  @ApiProperty({ type: [UserPriceEntryDto] })
  public prices!: UserPriceEntryDto[];
}
