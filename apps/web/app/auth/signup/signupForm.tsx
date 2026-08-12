"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { useSignupForm } from "@/hooks/useSignupForm";
import { PASSWORD_RULES } from "@/lib/password";
import { Check, Eye, EyeOff, X } from "lucide-react";

const SignupForm = () => {
  const {
    formRef,
    action,
    state,
    error,
    currentPassword,
    strength,
    isFormInvalid,
    isSuccess,
    persistValue,
    togglePasswordVisibility,
    showPassword,
    passwordFieldType,
  } = useSignupForm();

  return (
    <form ref={formRef} action={action} className="space-y-6">
      <div className="flex flex-col gap-5">
        {/* Global message: success (green) or error (red) */}
        {state?.message && (
          <div
            role="status"
            aria-live="polite"
            className={`flex flex-col items-center gap-1 rounded-lg p-3 text-sm font-medium ${
              isSuccess
                ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
            }`}
          >
            <span>{state.message}</span>
            {isSuccess && (
              <span className="text-xs opacity-80">
                Redirecting you to the sign in page…
              </span>
            )}
          </div>
        )}

        {/* Name input field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="sr-only">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Name"
            autoComplete="name"
            onChange={persistValue}
            aria-invalid={Boolean(error?.name?.length)}
            aria-describedby={error?.name?.length ? "name-error" : undefined}
          />
          {error?.name && (
            <p id="name-error" className="text-sm text-red-500 mt-1">
              {error.name}
            </p>
          )}
        </div>

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
              autoComplete="new-password"
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

          {/* Password strength meter */}
          {currentPassword && (
            <div className="mt-2 space-y-2">
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i < strength.score ? strength.color : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-medium text-muted-foreground">
                Strength:{" "}
                <span
                  className={
                    strength.score <= 1
                      ? "text-red-500"
                      : strength.score === 2
                        ? "text-orange-500"
                        : strength.score === 3
                          ? "text-yellow-600"
                          : "text-green-600"
                  }
                >
                  {strength.label}
                </span>
              </p>
            </div>
          )}

          {/* Live password rule checklist */}
          {currentPassword && (
            <ul className="mt-2 space-y-1 text-xs">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(currentPassword);
                return (
                  <li
                    key={rule.key}
                    className={`flex items-center gap-1.5 ${
                      ok ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {ok ? (
                      <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <X className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />
                    )}
                    <span>{rule.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <fieldset disabled={isFormInvalid || isSuccess} className="contents">
        {isFormInvalid && !isSuccess && (
          <p className="text-xs text-muted-foreground text-center">
            Please fix the errors above before submitting
          </p>
        )}
        <SubmitButton>Sign up</SubmitButton>
      </fieldset>
    </form>
  );
};

export default SignupForm;
