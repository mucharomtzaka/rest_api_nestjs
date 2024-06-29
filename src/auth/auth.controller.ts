import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
    Headers,
  } from "@nestjs/common"
  import { AuthService } from "./auth.service"
  import { LoginDto } from "./dto/login.dto"
  import { CreateUserDto } from "../users/dto/create-user.dto"
  import { JwtAuthGuard } from "./jwt-auth/jwt-auth.guard"
  import { TransformPasswordPipe } from "./tranform-password.pipe"
import { ApiParam } from "@nestjs/swagger"
import { RequestHeader } from "src/request_header"

  
  @Controller("auth")
  export class AuthController {
    /**
     * Constructor
     * @param authService
     */
    constructor(private authService: AuthService) {}
  
    /**
     * Register controller
     * @param dto
     * @returns
     */
    @UsePipes(ValidationPipe, TransformPasswordPipe)
    @HttpCode(200)
    @Post("register")
    async register(@Body() dto: CreateUserDto) {
      return await this.authService.register(dto)
    }
  
    /**
     * Login Controller
     * @param dto
     * @returns
     */
    @HttpCode(200)
    @Post("login")
    async login(@Body() dto: LoginDto) {
      return await this.authService.login(dto)
    }
  
    /**
     * Get detail User
     */
   
    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async profile(@RequestHeader() headers) {
        let token = headers.authorization.substring(7, headers.authorization.length);
         const profile = await this.authService.findUserProfil(token);
        return {
            message: "Profile",
            data : profile
        }
    }
  }