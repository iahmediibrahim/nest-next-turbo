import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * Coerce the raw `JWT_EXPIRES_IN` env string into the strict union
 * `JwtModuleOptions['signOptions']['expiresIn']`.
 *
 * Accepts either:
 *   - Purely numeric strings (e.g. `"3600"`) → converted to a numeric
 *     value interpreted as **seconds** (the jsonwebtoken default).
 *   - zeit/ms duration strings (e.g. `"7d"`, `"15m"`, `"24h"`) →
 *     passed through verbatim as `StringValue`.
 *
 * This helper exists because `process.env.JWT_EXPIRES_IN` has type
 * `string | undefined` (too wide for `@nestjs/jwt`) which previously
 * caused TS2322: "Type 'string | undefined' is not assignable to type
 * 'number | StringValue | undefined'".
 */
function parseExpiresIn(
  raw: string | undefined,
): NonNullable<JwtModuleOptions['signOptions']>['expiresIn'] {
  const value = raw as NonNullable<
    JwtModuleOptions['signOptions']
  >['expiresIn'];
  if (/^\d+$/.test(raw?.trim() || '')) {
    return Number(raw?.trim() || '');
  }
  return value;
}

/**
 * Namespaced Nest config for `@nestjs/jwt`.
 *
 * Registered under the namespace key `"jwt"` via `registerAs`. This
 * lets two pieces of code both read the config without duplicating
 * env access:
 *
 *   - `JwtModule.registerAsync(jwtConfig.asProvider())` → passes the
 *     options into the JWT module so `AuthService.generateToken()`
 *     can use `jwtService.signAsync()` with the correct secret /
 *     expiry.
 *   - `ConfigModule.forFeature(jwtConfig)` + `@Inject(jwtConfig.KEY)`
 *     → used by `JwtStrategy` to read the secret separately for
 *     passport-jwt's `StrategyOptions.secretOrKey` (needs a narrower
 *     type — string-only, no `KeyObject`).
 *
 * Both `JWT_SECRET` and `JWT_EXPIRES_IN` are read directly from the
 * environment with no dev fallbacks — the app will fail at runtime if
 * either variable is missing, which is the desired hard-fail behavior
 * (no silent fallback to insecure or arbitrary defaults).
 */
export default registerAs('jwt', (): JwtModuleOptions => {
  const secret = process.env.JWT_SECRET as NonNullable<
    JwtModuleOptions['secret']
  >;
  return {
    secret,
    signOptions: {
      expiresIn: parseExpiresIn(process.env.JWT_EXPIRES_IN),
    },
  };
});
