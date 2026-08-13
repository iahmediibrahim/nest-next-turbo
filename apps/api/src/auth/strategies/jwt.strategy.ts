import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import jwtConfig from '../config/jwt.config';
import type { AuthJwtPayload } from '../types/auth-jwtPayload';

/**
 * Shape attached to `req.user` by Passport after a successful Bearer
 * JWT validation. Explicit type so downstream controllers / guards can
 * safely destructure `req.user.id` without knowing JWT claim names.
 */
export type JwtRequestUser = {
  id: number;
};

/**
 * Passport "jwt" strategy — protects routes that expect a Bearer-token
 * Authorization header (used by mobile clients, third-party API
 * consumers, service-to-service calls, etc.).
 *
 * Trigger when a route is annotated with a guard like
 * `@UseGuards(AuthGuard('jwt'))` (see `JwtAuthGuard` — a mirror of the
 * existing `LocalAuthGuard`). Invocation order:
 *
 *   1. Extracts the JWT from the `Authorization: Bearer <token>` header.
 *   2. Verifies the signature + expiry using the secret configured in
 *      `jwt.config.ts` (reads directly from `process.env.JWT_SECRET` —
 *      must be set, no dev fallback).
 *   3. Calls `validate(payload)` below with the decoded claims —
 *      whatever it returns becomes `req.user`.
 *
 * NOTE: The Next.js web frontend does NOT use this strategy for normal
 * page loads — it stores auth in its own HTTP-only "session" cookie
 * validated at the Next.js layer. This strategy is for BEARER-token
 * clients only.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Configure passport-jwt with runtime-safe options.
   *
   * Narrowing the secret to a plain `string` here is intentional: the
   * Nest `JwtModuleOptions['secret']` type accepts `string | Buffer |
   * KeyObject`, but passport-jwt's `StrategyOptions` rejects
   * `KeyObject`. The cast is safe because `jwt.config.ts` reads the
   * secret directly from `process.env.JWT_SECRET` (always a string at
   * runtime when env is correctly configured).
   *
   * @param jwtConfiguration - Typed view of the `jwt` ConfigModule
   *   namespace (secret + signOptions). Injected via Nest's
   *   `jwtConfig.KEY` token.
   */
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    const secret = jwtConfiguration.secret as string;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  /**
   * Post-validation hook — called ONLY when the JWT signature is valid
   * AND `exp` has not passed (because `ignoreExpiration: false` above).
   *
   * Maps from the internal JWT claim format (`AuthJwtPayload.sub`) to
   * the app's normalized user shape (`JwtRequestUser.id`) so routes
   * never have to know about the `sub` claim name.  This is also a
   * natural place to add per-request user lookups in the future (e.g.
   * load roles, permissions, or ban status from the DB before the
   * handler executes).
   *
   * @param payload - Decoded JWT body; typed as `AuthJwtPayload` to
   *   match the output of `AuthService.generateToken()` → `{ sub }`.
   * @returns Normalized user object `{ id }` that gets attached to
   *   `req.user` for the lifetime of the request.
   */
  async validate(payload: AuthJwtPayload): Promise<JwtRequestUser> {
    return await this.authService.validateJwtUser(payload.sub);
  }
}
