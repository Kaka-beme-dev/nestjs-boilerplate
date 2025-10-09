import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthLocalLoginDto {
  @ApiProperty({ example: 'kaka167', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  user: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
