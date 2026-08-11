"use client";
import { signIn } from "@/lib/auth";
import { SigninFormSchema, type FormState } from "@/lib/type";
import { useActionState, useEffect, useRef, useState } from "react";
import z from "zod";

type FieldKey = keyof z.infer<typeof SigninFormSchema>;

export interface UseSigninFormResult {
  formRef: React.RefObject<HTMLFormElement | null>;
  state: FormState;
  error: NonNullable<FormState>["error"];
  isFormInvalid: boolean;
  isSuccess: boolean;
  showPassword: boolean;
  persistValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  togglePasswordVisibility: () => void;
  passwordFieldType: "text" | "password";
  action: (payload: FormData) => void;
}

export function useSigninForm(): UseSigninFormResult {
  const [state, action] = useActionState(signIn, undefined);

  const formRef = useRef<HTMLFormElement>(null);
  const valuesRef = useRef<Record<string, string>>({});
  const [localErrors, setLocalErrors] = useState<
    NonNullable<FormState>["error"]
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name: string, value: string) => {
    const key = name as FieldKey;
    const result = SigninFormSchema.partial().safeParse({ [key]: value });

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

  const isFormInvalid =
    Boolean(error?.email?.length) ||
    Boolean(error?.password?.length) ||
    !valuesRef.current.email ||
    !valuesRef.current.password;

  const isSuccess = Boolean(state?.success);

  return {
    formRef,
    state,
    error,
    isFormInvalid,
    isSuccess,
    showPassword,
    persistValue,
    togglePasswordVisibility,
    passwordFieldType: showPassword ? "text" : "password",
    action,
  };
}
