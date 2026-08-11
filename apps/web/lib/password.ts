export const SPECIAL_CHAR_REGEX =
  /[!@#$%^&*()_+\-=\[\]{}|;:'",.<>\/?]/;

export type PasswordRuleKey = "length" | "letter" | "number" | "special";

export interface PasswordRule {
  readonly key: PasswordRuleKey;
  readonly label: string;
  readonly test: (value: string) => boolean;
  readonly message: string;
}

export const PASSWORD_RULES: readonly PasswordRule[] = [
  {
    key: "length",
    label: "At least 8 characters",
    message: "Password must be of at least 8 characters",
    test: (v: string) => v.length >= 8,
  },
  {
    key: "letter",
    label: "Contains at least one letter",
    message: "Password must contain at least one letter",
    test: (v: string) => /[a-zA-Z]/.test(v),
  },
  {
    key: "number",
    label: "Contains at least one number",
    message: "Password must contain at least one number",
    test: (v: string) => /[0-9]/.test(v),
  },
  {
    key: "special",
    label: "Contains at least one special character",
    message: "Password must contain at least one special character",
    test: (v: string) => SPECIAL_CHAR_REGEX.test(v),
  },
] as const;

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Weak" | "Fair" | "Good" | "Strong" | "";
  color: "" | "bg-red-500" | "bg-orange-500" | "bg-yellow-500" | "bg-green-500";
}

export function computePasswordStrength(value: string): PasswordStrength {
  const passed = PASSWORD_RULES.filter((r) => r.test(value)).length;
  if (!value) return { score: 0, label: "", color: "" };
  if (passed <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (passed === 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
  if (passed === 3) return { score: 3, label: "Good", color: "bg-yellow-500" };
  return { score: 4, label: "Strong", color: "bg-green-500" };
}
