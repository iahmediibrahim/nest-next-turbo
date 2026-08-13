import { getSessionOrNull } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Home as HomeIcon, LayoutDashboard, Sparkles } from "lucide-react";
import Link from "next/link";
import SignInButton from "./SignInButton";
import { buttonVariants } from "./ui/button";

const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Home", icon: <HomeIcon className="h-3.5 w-3.5" /> },
] as const;

const AUTH_NAV_LINKS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-3.5 w-3.5" />,
  },
] as const;

const AppBar = async () => {
  const session = await getSessionOrNull();
  const isAuthenticated = Boolean(session?.user);
  const navLinks = isAuthenticated ? AUTH_NAV_LINKS : PUBLIC_NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 font-semibold tracking-tight transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="text-base">Nest Next Turbo</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <SignInButton />
      </div>
    </header>
  );
};

export default AppBar;
