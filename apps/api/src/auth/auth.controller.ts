import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

/**
 * HTTP entrypoints for authentication flows.
 *
 * All routes live under the `/auth` prefix (declared via the
 * `@Controller('auth')` decorator). This controller intentionally owns
 * NO business logic — it only validates inputs (via DTO + global
 * ValidationPipe), gates with the right Passport guards where needed,
 * and hands off to `AuthService` for the real work.
 */
// @Serialize(UserDto)
@Controller('auth')
export class AuthController {
  /**
   * Inject the auth service that implements registration + sign-in.
   *
   * @param authService - Handles the domain-level work of user creation,
   *   credential checking, and JWT minting.
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * `POST /auth/signup` — create a new user account.
   *
   * No session / auth guard is required (anonymous endpoint). The
   * incoming body is validated against `CreateUserDto` — class-validator
   * rules enforce email format, name length, and password complexity
   * before we ever hit the service layer.
   *
   * Success: 201 Created with the new user row (serialized shape TBD by
   * the commented-out `@Serialize(UserDto)` decorator).
   * Failure: 409 Conflict when email is taken; 400 Bad Request when any
   * DTO field fails validation.
   *
   * @param createUserDto - Name / email / password submitted by the
   *   frontend signup form.
   */
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  /**
   * `POST /auth/signin` — exchange credentials for user info + JWT.
   *
   * Wrapped in `@UseGuards(LocalAuthGuard)`, which means Nest runs the
   * entire Passport "local" strategy BEFORE the handler body executes:
   *   1. Passport extracts `email` + `password` from the JSON body.
   *   2. `LocalStrategy.validate()` calls
   *      `AuthService.validateLocalUser()` to verify the credentials.
   *   3. On success the returned `{ id, name }` shape is attached as
   *      `req.user`; on failure the guard short-circuits with 401.
   *
   * If we reach the handler body the caller is authenticated, so we
   * just read `req.user` and ask `AuthService.login()` to build the
   * final response (user info + signed access token).
   *
   * @param req - Express request object. `.user` is populated by the
   *   `LocalAuthGuard` with the output of `validateLocalUser()`.
   */
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req) {
    return this.authService.login(req.user.id, req.user.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req) {
    return { message: `Hello World! ${req.user.id}` };
  }
}
