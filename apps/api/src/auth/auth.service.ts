import { UserService } from '@/user/user.service';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthJwtPayload } from './types/auth-jwtPayload';

/**
 * Core business logic for the auth module.
 *
 * Orchestrates user registration, credential validation (used by the
 * LocalStrategy Passport flow), and access-token generation. All data
 * access (user lookup / creation) is delegated to `UserService`, while
 * cryptographic concerns (password hashing verification via argon2, JWT
 * signing via JwtService) live here so the user module stays agnostic
 * of auth-specific concerns.
 */
@Injectable()
export class AuthService {
  /**
   * Inject collaborators via Nest constructor DI.
   *
   * @param userService - Handles read/write access to the `User` table
   *   (find by email, create a new row).
   * @param jwtService - Signs the access-token JWT using the secret and
   *   expiry configured in `jwt.config.ts`.
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Register (sign up) a brand-new user account.
   *
   * Behavior:
   * 1. Rejects with 409 Conflict if the email is already taken — keeps
   *    the `users.email` unique constraint from bubbling up as a raw
   *    database error.
   * 2. Delegates the actual insert to `UserService.create()`, which is
   *    responsible for hashing the password with argon2 before writing
   *    to Postgres.
   *
   * @param createUserDto - Validated name / email / password payload
   *   coming from the controller (enforced by class-validator DTO rules
   *   on the global ValidationPipe).
   * @returns The newly persisted user row (without the hashed password
   *   if UserService implements a serializer — currently the raw row is
   *   returned as-is).
   * @throws ConflictException - When another user already owns this
   *   email address.
   */
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return await this.userService.create(createUserDto);
  }

  /**
   * Validate email + password credentials for the "local" Passport
   * strategy (classic username/password sign-in flow).
   *
   * Called by `LocalStrategy.validate()` after Passport extracts the
   * `email`/`password` fields from the incoming POST body. Returns a
   * minimal user-shape on success, or throws a Passport-compatible
   * 401 that Nest translates into `Unauthorized`.
   *
   * @param email - Plaintext email submitted by the client.
   * @param password - Plaintext password submitted by the client (will
   *   be compared against the argon2 hash stored in Postgres).
   * @returns Lightweight user descriptor `{ id, name }` — this is what
   *   Passport attaches to `req.user` after a successful
   *   `LocalAuthGuard`.
   * @throws UnauthorizedException - `User not found` when the email has
   *   no account, `Invalid Credentials!` when the argon2 verify step
   *   fails.
   */
  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');

    const pwValid = await argon2.verify(user.password, password);
    console.log(pwValid);
    if (!pwValid) throw new UnauthorizedException('Invalid Credentials!');

    return { id: user.id, name: user.name };
  }

  /**
   * Build the response object returned by a successful sign-in.
   *
   * Runs *after* `LocalAuthGuard` has already accepted the credentials
   * (i.e. `validateLocalUser` above passed). Generates a short-lived
   * JWT access token and shapes the payload the frontend uses to
   * populate its own session cookie (see `apps/web/lib/auth.ts` →
   * `signIn()` which calls `createSession()` with the fields returned
   * here).
   *
   * @param userId - `id` of the user logging in (already verified by
   *   the guard).
   * @param name - User display name; threaded through so the frontend
   *   can show "Welcome back, Alice" without an extra `/me` round trip.
   * @returns `{ id, name, accessToken }` — note that `accessToken` is
   *   currently NOT used by the web frontend (which uses its own
   *   HTTP-only JWT `session` cookie), but is returned so mobile /
   *   third-party clients can do standard Bearer auth via the
   *   `JwtStrategy`.
   */
  async login(userId: number, name?: string) {
    const { accessToken } = await this.generateToken(userId);
    return { id: userId, name, accessToken };
  }

  /**
   * Sign the canonical access-token JWT for a given user ID.
   *
   * The payload shape matches `AuthJwtPayload` → `{ sub: userId }`,
   * following the JWT convention of `sub` (subject) for the principal
   * identifier. Both `JwtStrategy.validate()` (backend Bearer auth) and
   * the frontend `jose` session JWT helpers expect this shape.
   *
   * Signing options (secret, expiry, algorithm) are pulled from
   * `jwt.config.ts`, which reads from `process.env.JWT_SECRET` /
   * `JWT_EXPIRES_IN` with sensible development fallbacks.
   *
   * @param userId - Value to write to `sub`; corresponds to
   *   `users.id` in the database.
   * @returns Object bag `{ accessToken }` — the signed JWT string.
   */
  async generateToken(userId: number) {
    const payload: AuthJwtPayload = {
      sub: userId,
    };
    const [accessToken] = await Promise.all([
      this.jwtService.signAsync(payload),
    ]);
    return { accessToken };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return { id: user.id };
  }
}
