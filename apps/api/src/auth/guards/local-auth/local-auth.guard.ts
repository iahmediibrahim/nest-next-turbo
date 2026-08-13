import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Protects a route with the Passport "local" (email + password) strategy.
 *
 * Usage: decorate a controller handler with
 * `@UseGuards(LocalAuthGuard)`. When the request arrives, Nest /
 * Passport will:
 *   - Parse `email` + `password` out of the JSON body
 *   - Run `LocalStrategy.validate(email, password)` (calls
 *     `AuthService.validateLocalUser()` → DB lookup + argon2 verify)
 *   - Short-circuit with 401 Unauthorized on failure; attach
 *     `req.user` on success and let the handler run.
 *
 * See `AuthController.login()` for the single current user of this
 * guard (`POST /auth/signin`).
 *
 * Extending `AuthGuard('local')` as a class is the canonical Nest
 * pattern: it avoids re-typing the magic string `'local'` at every
 * call site, and gives us a spot to add request-logging hooks / custom
 * error handling later without touching callers.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
