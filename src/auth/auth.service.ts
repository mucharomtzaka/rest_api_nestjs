import { HttpException, HttpStatus, Injectable , ConflictException} from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from "@nestjs/jwt"
import { LoginDto } from "./dto/login.dto"
import { omit } from "lodash"
import * as bcrypt from "bcrypt"
import { JwtConfig } from "src/jwt.config"
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { randomUUID } from 'crypto';
import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthService {
 
  constructor(@InjectModel(User.name) private readonly AuthModule: Model<UserDocument> , private jwtService: JwtService,) {}

  /**
   * Register Service
   * @param dto
   * @returns
   */
  async register(user: CreateUserDto) {
        const alreadyExists = await this.AuthModule.exists({ email: user.email }).lean();
        if (alreadyExists) {
        throw new ConflictException(`User with that email already exists`);
        }
        const userToCreate: User = { ...user, userId: randomUUID(),};
        let createuser =   this.AuthModule.create(userToCreate);
        if (createuser) {
            return {
              statusCode: 200,
              message: "Register success",
              data : createuser
            }
          }
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST)
  }

  /**
   * Login Service
   * @param dto
   * @returns
   */
  async login(dto: LoginDto) {
    const user = await this.AuthModule.findOne({ email:dto.email }).lean();
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    var checkPassword = await bcrypt.compare(dto.password, user.password)

    if (checkPassword) {
        return await this.generateJwt(
            user.id,
            user.email,
            user,
            JwtConfig.user_secret,
            JwtConfig.user_expired
          )
    }
    throw new HttpException("Credential Incorrect", HttpStatus.UNAUTHORIZED)
  }

  /**
   * Generate JWT
   * @param userId
   * @param email
   * @param user
   * @param secret
   * @param expired
   * @returns
   */
  async generateJwt(
    userId: any,
    email: string,
    user: any,
    secret: any,
    expired = JwtConfig.user_expired
  ) {
    let accessToken = await this.jwtService.sign(
      {
        sub: userId,
        email,
        name: user.name + " " + user.last_name,
      },
      {
        expiresIn: expired,
        secret,
      }
    )
    return {
      statusCode: 200,
      accessToken: accessToken,
      user: omit(user, ["password", "created_at", "updated_at"]),
    }
  }

  async findUserProfil(token:string){
    const decoded = jwt.verify(token, JwtConfig.user_secret);
    const user = await this.AuthModule.findOne({ email: decoded['email'] }).lean();
    return user;
  }
}

