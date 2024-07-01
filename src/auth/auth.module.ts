import { Module } from "@nestjs/common"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtStrategy } from "./jwt.strategy"
import { JwtConfig } from "src/jwt.config"
import { UsersService } from "src/users/users.service"
import { UsersController } from "src/users/users.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema ,}]),
    PassportModule.register({
      defaultStrategy: "jwt",
      property: "user",
      session: false,
    }),
    JwtModule.register({
      secret: JwtConfig.user_secret,
      signOptions: {
        expiresIn: JwtConfig.user_expired,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy,UsersService],
  controllers: [AuthController,UsersController],
})
export class AuthModule {}