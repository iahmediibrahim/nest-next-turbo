import z from "zod";
import { PASSWORD_RULES, SPECIAL_CHAR_REGEX } from "./password";
export type FormState =
  | {
      error?: { name?: string[]; email?: string[]; password?: string[] };
      message?: string;
      success?: boolean;
    }
  | undefined;

const lengthRule = PASSWORD_RULES.find((r) => r.key === "length")!;
const letterRule = PASSWORD_RULES.find((r) => r.key === "letter")!;
const numberRule = PASSWORD_RULES.find((r) => r.key === "number")!;
const specialRule = PASSWORD_RULES.find((r) => r.key === "special")!;

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required and must be at least 2 characters")
    .trim(),
  email: z.email({ message: "Invalid email" }).trim(),
  password: z
    .string()
    .min(8, lengthRule.message)
    .regex(/[a-zA-Z]/, letterRule.message)
    .regex(/[0-9]/, numberRule.message)
    .regex(SPECIAL_CHAR_REGEX, specialRule.message)
    .trim(),
});

export const SigninFormSchema = z.object({
  email: z.email({ message: "Invalid email" }).trim(),
  password: z.string().min(1, "Password is required"),
});
