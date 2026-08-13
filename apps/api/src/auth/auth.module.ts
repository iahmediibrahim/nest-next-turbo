import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from './config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

/**
 * Nest module bundling all authentication concerns.
 *
 * Responsibilities grouped in this module:
 *
 * **Imports (infrastructure)**
 * - `JwtModule.registerAsync(jwtConfig.asProvider())` — provides the
 *   injectable `JwtService` used by `AuthService.generateToken()` to
 *   sign access tokens. Options (secret + expiry) come from the
 *   namespaced `jwt` config.
 * - `ConfigModule.forFeature(jwtConfig)` — makes the `jwt` namespace
 *   config available for `@Inject(jwtConfig.KEY)` injection, which
 *   `JwtStrategy` uses to read the secret separately from
 *   `@nestjs/jwt` (passport-jwt needs it for verification).
 *
 * **Controllers (HTTP entry points)**
 * - `AuthController` — `POST /auth/signup` (anon creates user) and
 *   `POST /auth/signin` (LocalAuthGuard protected, returns JWT).
 *
 * **Providers (wired via Nest DI)**
 * - `AuthService` — domain logic: registration, credential validation,
 *   access-token generation.
 * - `UserService` + `PrismaService` — transitive data-access
 *   dependencies needed to lookup/create users in the DB.
 * - `LocalStrategy` — Passport strategy for email/password flows;
 *   used by `LocalAuthGuard` on the sign-in route.
 * - `JwtStrategy` — Passport strategy for `Authorization: Bearer …`
 *   header auth; used by a future `JwtAuthGuard` for API routes.
 *
 * NOTE: `UserService` and `PrismaService` are re-provided here for
 * convenience. If the app later adds lazy-loaded feature modules that
 * share UserService, move them up to a shared module and import that
 * instead.
 */
@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
