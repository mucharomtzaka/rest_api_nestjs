import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-user')
  @Post('create-message')
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully created.',
  })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    return await this.messagesService.createMessage(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-user')
  @Get(':id')
  async getAllMessagesByChatId(@Param('id') id: string) {
    return await this.messagesService.findAllMessages(id);
  }
}