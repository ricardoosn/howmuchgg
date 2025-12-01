import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessResponseDto {
  @ApiProperty({ example: true })
  public ok!: boolean;

  @ApiProperty({
    description: 'JWT stored in session',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  public token!: string;
}
