import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty,  IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'jeanpi3rm@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;


  @ApiProperty({
    example: '12345678',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}