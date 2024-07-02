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
  async refreshtoken(token:string){
    const decoded = jwt.verify(token, JwtConfig.user_secret);
    const user = await this.AuthModule.findOne({ email: decoded['email'] }).lean();
    let refreshToken = this.jwtService.sign(user, {
      secret: JwtConfig.user_secret,
      expiresIn: JwtConfig.user_expired
    });
    return refreshToken;
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token, {
      secret: JwtConfig.user_secret,
    });
    const useremail = payload.email
    if (useremail) {
        return this.AuthModule.findOne({ email:useremail }).lean();
    }
  }

  async zodiacget(birthday:string){

    // Define a map for month names to numbers
  const monthMap = {
    "Januari": "01",
    "Februari": "02",
    "Maret": "03",
    "April": "04",
    "Mei": "05",
    "Juni": "06",
    "Juli": "07",
    "Agustus": "08",
    "September": "09",
    "Oktober": "10",
    "November": "11",
    "Desember": "12"
  };

  // Split the input date string
    const dateParts = birthday.split(" ");
    const dayx = dateParts[0].padStart(2, '0');
    const monthx = monthMap[dateParts[1]];
    const year = dateParts[2];
    const formatf = `${year}-${monthx}-${dayx}`;
    const birthDate = new Date(formatf);
    const month = birthDate.getUTCMonth() + 1;
    const day = birthDate.getUTCDate();
    const years = birthDate.getUTCFullYear();
    const zodiacSign = this.getZodiacSign(month, day);
    return {
      zodiac_chiness : this.getZodiacAnimalByYear(years),
      horoscope_star: zodiacSign
    };
  }

  private getZodiacSign(month: number, day: number): string {
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
      return 'Aquarius';
    } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
      return 'Pisces';
    } else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
      return 'Aries';
    } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
      return 'Taurus';
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
      return 'Gemini';
    } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
      return 'Cancer';
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
      return 'Leo';
    } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
      return 'Virgo';
    } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
      return 'Libra';
    } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
      return 'Scorpio';
    } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
      return 'Sagittarius';
    } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
      return 'Capricorn';
    }
    return 'Unknown';
  }

  private getZodiacAnimalByYear(year: number): string {
    const zodiacAnimals = [
      'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
      'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
    ];

    const index = (year - 4) % 12;
    return zodiacAnimals[index];
  }

}

