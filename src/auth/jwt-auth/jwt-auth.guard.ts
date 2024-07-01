import {
  ExecutionContext,
  UnauthorizedException,
  CanActivate
} from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

export class JwtAuthGuard extends AuthGuard("jwt-user") implements CanActivate {


  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.

    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}