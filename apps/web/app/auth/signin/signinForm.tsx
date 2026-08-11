"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { useSigninForm } from "@/hooks/useSigninForm";
import { Eye, EyeOff } from "lucide-react";

const SigninForm = () => {
  const {
    formRef,
    action,
    state,
    error,
    isFormInvalid,
    isSuccess,
    persistValue,
    togglePasswordVisibility,
    showPassword,
    passwordFieldType,
  } = useSigninForm();

  return (
    <form ref={formRef} action={action} className="space-y-6">
      <div className="flex flex-col gap-5">
        {/* Global message: success (green) or error (red) */}
        {state?.message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex justify-center rounded-lg p-3 text-sm font-medium ${
              isSuccess
                ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Email input field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="sr-only">
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email address"
            autoComplete="email"
            onChange={persistValue}
            aria-invalid={Boolean(error?.email?.length)}
            aria-describedby={error?.email?.length ? "email-error" : undefined}
          />
          {error?.email && (
            <p id="email-error" className="text-sm text-red-500 mt-1">
              {error.email}
            </p>
          )}
        </div>

        {/* Password input field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="sr-only">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={passwordFieldType}
              required
              placeholder="Password"
              autoComplete="current-password"
              onChange={persistValue}
              aria-invalid={Boolean(error?.password?.length)}
              aria-describedby={
                error?.password?.length ? "password-error" : undefined
              }
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {error?.password && (
            <p id="password-error" className="text-sm text-red-500 mt-1">
              {error.password}
            </p>
          )}
        </div>
      </div>

      <fieldset disabled={isFormInvalid || isSuccess} className="contents">
        {isFormInvalid && !isSuccess && (
          <p className="text-xs text-muted-foreground text-center">
            Please fix the errors above before signing in
          </p>
        )}
        <SubmitButton>Sign in</SubmitButton>
      </fieldset>
    </form>
  );
};

export default SigninForm;
