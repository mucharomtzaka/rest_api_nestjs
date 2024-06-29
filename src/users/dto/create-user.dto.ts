import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'jeanpi3rm@gmail.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Jeanpier',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({
    example: 'Mendoza',
    description: 'The surname of the user',
  })
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @ApiProperty({
    example: '12345678',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interest?: string[];
}