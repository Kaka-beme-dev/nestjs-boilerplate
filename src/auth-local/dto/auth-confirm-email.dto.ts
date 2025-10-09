import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthLocalConfirmEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
