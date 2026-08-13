/**
 * Canonical JWT claim shape for access tokens minted by this API.
 *
 * Uses the industry-standard `sub` (subject) claim to hold the user
 * identifier. This same shape is:
 *
 *   - Written by `AuthService.generateToken(userId)` →
 *     `jwtService.signAsync({ sub: userId })`.
 *   - Read by `JwtStrategy.validate(payload)` → maps to the
 *     app-normalized `{ id: payload.sub }` (`JwtRequestUser`).
 *   - Matches the type expected by the frontend session JWT helpers
 *     in `apps/web/lib/sessionTokens.ts` so both sides of the
 *     full-stack agree on what a "session/user ID" looks like.
 */
export type AuthJwtPayload = {
  sub: number;
};
