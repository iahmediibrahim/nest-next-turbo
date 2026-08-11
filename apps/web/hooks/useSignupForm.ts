"use client";
import { signUp } from "@/lib/auth";
import { computePasswordStrength, type PasswordStrength } from "@/lib/password";
import { SignupFormSchema, type FormState } from "@/lib/type";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import z from "zod";

type FieldKey = keyof z.infer<typeof SignupFormSchema>;

export interface UseSignupFormResult {
  formRef: React.RefObject<HTMLFormElement | null>;
  state: FormState;
  error: NonNullable<FormState>["error"];
  currentPassword: string;
  strength: PasswordStrength;
  isFormInvalid: boolean;
  isSuccess: boolean;
  showPassword: boolean;
  persistValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglePasswordVisibility: () => void;
  passwordFieldType: "text" | "password";
  action: (payload: FormData) => void;
}

export function useSignupForm(): UseSignupFormResult {
  const [state, action] = useActionState(signUp, undefined);

  const formRef = useRef<HTMLFormElement>(null);
  const valuesRef = useRef<Record<string, string>>({});
  const [localErrors, setLocalErrors] = useState<
    NonNullable<FormState>["error"]
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string) => {
    const key = name as FieldKey;
    const result = SignupFormSchema.partial().safeParse({ [key]: value });

    if (result.success) {
      setLocalErrors((prev) => ({ ...prev, [key]: undefined }));
    } else {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      setLocalErrors((prev) => ({ ...prev, [key]: fieldErrors[key] }));
    }
  };

  const persistValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    valuesRef.current[name] = value;
    validateField(name, value);
  };

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    for (const [name, value] of Object.entries(valuesRef.current)) {
      const input = form.elements.namedItem(name) as HTMLInputElement | null;
      if (input && input.value !== value) input.value = value;
    }
  }, [state]);

  const togglePasswordVisibility = () => setShowPassword((p) => !p);

  const error = { ...localErrors, ...(state?.error ?? {}) };
  const currentPassword = valuesRef.current.password ?? "";

  const strength = useMemo(
    () => computePasswordStrength(currentPassword),
    [currentPassword],
  );

  const isFormInvalid =
    Boolean(error?.name?.length) ||
    Boolean(error?.email?.length) ||
    Boolean(error?.password?.length) ||
    !valuesRef.current.name ||
    !valuesRef.current.email ||
    !valuesRef.current.password;

  const isSuccess = Boolean(state?.success);

  return {
    formRef,
    action,
    state,
    error,
    currentPassword,
    strength,
    isFormInvalid,
    isSuccess,
    showPassword,
    persistValue,
    togglePasswordVisibility,
    passwordFieldType: showPassword ? "text" : "password",
  };
}
