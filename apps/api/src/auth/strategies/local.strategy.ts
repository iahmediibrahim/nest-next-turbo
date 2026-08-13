import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

/**
 * Passport "local" strategy — classic email + password credential check.
 *
 * Registered as a Nest provider in `AuthModule`. When a route is
 * decorated with `@UseGuards(LocalAuthGuard)`, Passport invokes this
 * strategy under the hood:
 *
 *   1. Reads `email` + `password` from the request body (the default
 *      `passport-local` fields are `username` / `password`, so we
 *      override with `usernameField: 'email'` to match our API).
 *   2. Calls `validate(email, password)` below, which delegates to
 *      `AuthService.validateLocalUser()` to hit the database and run
 *      the argon2 verify step.
 *   3. On success, whatever `validate()` returns becomes `req.user`
 *      for the downstream route handler. On a thrown
 *      `UnauthorizedException`, Passport short-circuits with 401.
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * Configure passport-local to look for credentials in the `email`
   * field rather than the default `username` field.
   *
   * @param authService - Used to run the actual credential check in
   *   `validate()`.
   */
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  /**
   * Passport validation hook — implemented by *every* Passport strategy.
   *
   * For the local strategy this is where we trade email+password for a
   * user object; the return value is persisted on the Express request
   * as `req.user` so the `POST /auth/signin` controller can read it
   * directly (it never has to touch the raw password itself).
   *
   * @param email - Extracted from the incoming JSON body by
   *   passport-local using the `usernameField: 'email'` mapping above.
   * @param password - Extracted from the incoming JSON body by
   *   passport-local; compared against the stored argon2 hash inside
   *   `AuthService.validateLocalUser()`.
   * @returns `{ id, name }` — minimal shape required by the sign-in
   *   controller to build a session / JWT response.
   */
  validate(email: string, password: string) {
    return this.authService.validateLocalUser(email, password);
  }
}
