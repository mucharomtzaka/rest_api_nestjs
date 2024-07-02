import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, versionKey: false })
export class User {
  @ApiProperty({
    example: '8104f19c-a2d8-40f7-9a0b-12f4c6a4b80a',
    description: 'The ID of the user',
  })
  @Prop({
    required: true,
    index: { unique: true },
    default: () => randomUUID(),
  })
  userId: string;

  @ApiProperty({
    example: 'Jeanpier',
    description: 'The name of the user',
  })
  @Prop({ required: true, trim: true, lowercase: true })
  name: string;

  @ApiProperty({
    example: 'Mendoza',
    description: 'The username of the user',
  })
  @Prop({ required: true, trim: true, lowercase: true })
  username: string;

  @ApiProperty({
    example: 'jeanpi3rm@gmail.com',
    description: 'The email of the user',
  })
  @Prop({
    required: true,
    index: { unique: true },
    lowercase: true,
  })
  email: string;

  @ApiProperty({
    example: '12345678',
    description: 'The password of the user',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: "14 Mei 1992",
    description: "User's birthday",
    required: false,
  })
  @Prop(String)
  birthday:string


  @ApiProperty({
    example: ['music', 'sepak bola'],
    description: "User's interest",
    required: false,
  })
  @Prop([String])
  interest?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);