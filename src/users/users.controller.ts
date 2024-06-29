import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,ValidationPipe,UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserResponse } from './dto/delete-response.dto';
import { FindOneParams } from './dto/find-one-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard"
import { TransformPasswordPipe } from "../auth/tranform-password.pipe"


// @UseInterceptors(ClassSerializerInterceptor)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/all")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({
    description: 'The users were successfully obtained.',
    type: [User],
  })
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Get a user by userId.',
  })
  @ApiOkResponse({
    description: 'The user was successfully obtained.',
    type: User,
  })
  async getById(@Param() { userId }: FindOneParams): Promise<User> {
    return this.usersService.findById(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe, TransformPasswordPipe)
  @ApiOperation({ description: 'Create a user.' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.usersService.create(user);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Update a user by userId.',
  })
  @ApiOkResponse({
    description: 'The user was successfully updated.',
    type: User,
  })
  async update(
    @Param() { userId }: FindOneParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateById(userId, updateUserDto);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Delete a user by userId.',
  })
  @ApiOkResponse({
    description: 'The user was successfully deleted.',
    type: DeleteUserResponse,
  })
  async deleteById(@Param() { userId }: FindOneParams): Promise<DeleteUserResponse> {
    return this.usersService.remove(userId);
  }
}