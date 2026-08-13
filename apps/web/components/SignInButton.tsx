import { logOut } from "@/lib/auth";
import { getSessionOrNull } from "@/lib/session";
import { cn, getInitials } from "@/lib/utils";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { buttonVariants } from "./ui/button";

const SignInButton = async () => {
  const session = await getSessionOrNull();
  const user = session?.user;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/signup"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Sign up
        </Link>
        <Link
          href="/auth/signin"
          className={cn(buttonVariants({ variant: "default", size: "sm" }))}
        >
          Sign in
        </Link>
      </div>
    );
  }

  const initials = getInitials(user.name);

  return (
    <div className="flex items-center gap-3">
      {/* User identity: initials avatar + name */}
      <div className="flex items-center gap-2.5">
        <div
          aria-hidden="true"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground ring-1 ring-border"
        >
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium text-foreground max-w-[140px] truncate">
          {user.name}
        </span>
      </div>

      {/* Log out form — calls logOut server action */}
      <form action={logOut}>
        <LogoutButton />
      </form>
    </div>
  );
};

export default SignInButton;
