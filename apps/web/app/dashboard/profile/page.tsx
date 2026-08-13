import LogoutButton from "@/components/LogoutButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { getProfile } from "@/lib/actions";
import { logOut } from "@/lib/auth";
import { PASSWORD_RULES, computePasswordStrength } from "@/lib/password";
import { getSession } from "@/lib/session";
import { cn, getInitials } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
  UserCog,
} from "lucide-react";
import Link from "next/link";

const securityEvents = [
  {
    title: "Password changed",
    sub: "Changed from Web · Chrome on macOS",
    time: "Yesterday",
    positive: true,
  },
  {
    title: "New sign in",
    sub: "San Francisco, CA · Chrome on macOS",
    time: "2 days ago",
    positive: true,
  },
  {
    title: "Account created",
    sub: "Welcome aboard! 🚀",
    time: "3 weeks ago",
    positive: true,
  },
];

export default async function ProfilePage() {
  const session = await getSession();
  const { user } = session!;
  const profile = await getProfile();
  console.log("profile", profile);
  const initials = getInitials(user.name);
  const firstName = user.name.split(" ")[0] ?? user.name;

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <header className="mb-8">
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 mb-4 text-muted-foreground",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Profile &amp; account
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your personal info, sign-in credentials, and account
              settings.
            </p>
          </div>
        </header>

        <div className="space-y-6">
          {/* Profile header card */}
          <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div
                aria-hidden="true"
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary ring-1 ring-border"
              >
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground truncate">
                    {user.name}
                  </h2>
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                    title="Email verified"
                  >
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground truncate">
                  User ID #{user.id}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  <UserCog className="h-3.5 w-3.5" />
                  Edit photo
                </Link>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column: editable forms */}
            <div className="space-y-6 lg:col-span-2">
              {/* Personal information */}
              <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-border">
                    <UserCircle2 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Personal information
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Update your name and contact details.
                    </p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-name">Full name</Label>
                      <Input
                        id="profile-name"
                        name="name"
                        defaultValue={user.name}
                        autoComplete="name"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Displayed in the header, invitations, and invoices.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-email">Email address</Label>
                      <Input
                        id="profile-email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        disabled
                        className="opacity-80"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Contact your account admin to change the email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" size="sm">
                      Cancel
                    </Button>
                    <Button type="button" size="sm">
                      Save changes
                    </Button>
                  </div>
                </form>
              </section>

              {/* Change password */}
              <section className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-border">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Change password
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Use a strong unique password to keep your account safe.
                    </p>
                  </div>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="password-current">Current password</Label>
                      <Input
                        id="password-current"
                        name="currentPassword"
                        type="password"
                        autoComplete="current-password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-new">New password</Label>
                      <Input
                        id="password-new"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-confirm">
                        Confirm new password
                      </Label>
                      <Input
                        id="password-confirm"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <PasswordHints />

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" size="sm">
                      Cancel
                    </Button>
                    <SubmitButton>Update password</SubmitButton>
                  </div>
                </form>
              </section>

              {/* Danger zone */}
              <section className="rounded-xl border border-destructive/40 bg-destructive/[0.03] p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive ring-1 ring-destructive/20">
                    <AlertTriangle className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Danger zone
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Actions here are irreversible — proceed with caution.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col rounded-lg border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground ring-1 ring-border shrink-0">
                        <KeyRound className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          Sign out everywhere
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          End all active sessions on other devices.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm">
                        Sign out all
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col rounded-lg border border-destructive/40 bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-md bg-destructive/10 text-destructive ring-1 ring-destructive/20 shrink-0">
                        <ShieldAlert className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-destructive">
                          Delete account
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Permanently remove {firstName}&rsquo;s account and all
                          data.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="destructive" size="sm">
                        Delete account…
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column: summaries / security activity */}
            <div className="space-y-6">
              {/* Account security summary */}
              <aside className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-border">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      Account security
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Current sign-in protections.
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  <SecurityRow
                    label="Password"
                    value="Strength: Good"
                    tone="good"
                  />
                  <SecurityRow
                    label="Two-factor auth"
                    value="Not enabled"
                    tone="warn"
                  />
                  <SecurityRow
                    label="Recovery codes"
                    value="Set up"
                    tone="good"
                  />
                  <SecurityRow
                    label="Active sessions"
                    value="2 devices"
                    tone="neutral"
                  />
                </ul>
              </aside>

              {/* Recent security activity */}
              <aside className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-foreground">
                    Recent security activity
                  </h3>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "xs" }),
                      "text-muted-foreground",
                    )}
                  >
                    View all
                  </Link>
                </div>

                <ul className="divide-y divide-border -my-2">
                  {securityEvents.map((evt) => (
                    <li key={evt.title + evt.time} className="py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span
                            className={cn(
                              "mt-0.5 inline-block h-2 w-2 rounded-full shrink-0",
                              evt.positive
                                ? "bg-emerald-500"
                                : "bg-destructive",
                            )}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {evt.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground truncate">
                              {evt.sub}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">
                          {evt.time}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Quick sign-out card */}
              <aside className="rounded-xl border border-border bg-background p-5 sm:p-6 shadow-sm">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Need a break?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign out of this browser to protect your session on a shared
                  device.
                </p>
                <form action={logOut}>
                  <LogoutButton label="Sign out this browser" />
                </form>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordHints() {
  const empty = "";
  const strength = computePasswordStrength(empty);

  return (
    <div className="rounded-lg bg-muted/40 p-3.5 ring-1 ring-border/60">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Password strength
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            strength.score === 0 && "text-muted-foreground",
            strength.score === 1 && "text-rose-600",
            strength.score === 2 && "text-amber-600",
            strength.score === 3 && "text-emerald-600",
            strength.score >= 4 && "text-emerald-600",
          )}
        >
          {strength.label}
        </span>
      </div>
      <div aria-hidden="true" className="grid grid-cols-4 gap-1.5 h-1.5 mb-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "rounded-full transition-colors",
              i < strength.score
                ? (strength.score <= 1 && "bg-rose-500") ||
                    (strength.score === 2 && "bg-amber-500") ||
                    (strength.score >= 3 && "bg-emerald-500")
                : "bg-muted",
            )}
          />
        ))}
      </div>
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => (
          <li
            key={rule.key}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
          >
            <span className="text-muted-foreground/70">·</span>
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Tone = "good" | "warn" | "neutral";

function SecurityRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: Tone;
}) {
  return (
    <li className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          tone === "good" && "text-emerald-600",
          tone === "warn" && "text-amber-600",
          tone === "neutral" && "text-foreground",
        )}
      >
        {value}
      </span>
    </li>
  );
}
