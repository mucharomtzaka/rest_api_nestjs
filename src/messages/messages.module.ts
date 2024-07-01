import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from './entities/message.entity';
import { MessageSchema } from './schema/message.schema';
import { MessagesRepository } from './message.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService,MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
