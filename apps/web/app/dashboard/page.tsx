import LogoutButton from "@/components/LogoutButton";
import { buttonVariants } from "@/components/ui/button";
import { logOut } from "@/lib/auth";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import {
  Activity,
  CreditCard,
  LayoutDashboard,
  Settings,
  UserCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getSession();
  console.log(session);
  const { user } = session!;

  const stats = [
    {
      label: "Active users",
      value: "12,480",
      delta: "+12.5%",
      positive: true,
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "MRR",
      value: "$48,320",
      delta: "+8.2%",
      positive: true,
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      label: "Signups (7d)",
      value: "1,294",
      delta: "+23.1%",
      positive: true,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "Churn",
      value: "1.8%",
      delta: "-0.4%",
      positive: false,
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const recentActivity = [
    {
      title: "New user signed up",
      sub: "jane.smith@example.com joined Starter plan",
      time: "2 min ago",
    },
    {
      title: "Subscription upgraded",
      sub: "john.doe@example.com → Pro plan",
      time: "45 min ago",
    },
    {
      title: "Invoice paid",
      sub: "$299.00 — Invoice #INV-2048",
      time: "3 hours ago",
    },
    {
      title: "Password changed",
      sub: "Security settings updated by alice",
      time: "Yesterday",
    },
  ];

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      active: true,
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: <UserCircle2 className="h-4 w-4" />,
      active: false,
    },
    {
      label: "Users",
      href: "#",
      icon: <Users className="h-4 w-4" />,
      active: false,
    },
    {
      label: "Activity",
      href: "#",
      icon: <Activity className="h-4 w-4" />,
      active: false,
    },
    {
      label: "Billing",
      href: "#",
      icon: <CreditCard className="h-4 w-4" />,
      active: false,
    },
    {
      label: "Settings",
      href: "#",
      icon: <Settings className="h-4 w-4" />,
      active: false,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Page header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Welcome back, {user.name.split(" ")[0] ?? user.name} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&rsquo;s what&rsquo;s happening with your workspace today.
            </p>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar nav */}
          <aside className="lg:sticky lg:top-20 lg:h-fit rounded-xl border border-border bg-background p-3">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}

              {/* Mobile-only logout inside sidebar */}
              <form
                action={logOut}
                className="mt-2 hidden lg:block w-full border-t border-border pt-2"
              >
                <LogoutButton label="Sign out" />
              </form>
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-6">
            {/* Stats grid */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-background p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {s.label}
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground ring-1 ring-border">
                      {s.icon}
                    </span>
                  </div>
                  <p className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                    {s.value}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xs font-medium",
                      s.positive ? "text-emerald-600" : "text-rose-600",
                    )}
                  >
                    {s.delta} vs last week
                  </p>
                </div>
              ))}
            </section>

            {/* Recent activity */}
            <section className="rounded-xl border border-border bg-background shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-semibold text-foreground">
                    Recent activity
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    The latest events across your workspace
                  </p>
                </div>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-xs",
                  )}
                >
                  View all
                </Link>
              </div>
              <ul className="divide-y divide-border">
                {recentActivity.map((a) => (
                  <li
                    key={a.title + a.time}
                    className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1.5 inline-block h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {a.title}
                        </p>
                        <p className="text-sm text-muted-foreground">{a.sub}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {a.time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Quick actions */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                <h3 className="font-semibold text-foreground">
                  Invite your team
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Collaborate better with teammates — up to 10 users on the free
                  plan.
                </p>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-4",
                  )}
                >
                  Send invites
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                <h3 className="font-semibold text-foreground">Upgrade plan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Unlock advanced analytics, SSO, and priority support.
                </p>
                <Link
                  href="#"
                  className={cn(buttonVariants({ size: "sm" }), "mt-4")}
                >
                  View plans
                </Link>
              </div>
              <div className="rounded-xl border border-border bg-background p-5 shadow-sm">
                <h3 className="font-semibold text-foreground">
                  Account security
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add two-factor authentication and review recent logins.
                </p>
                <Link
                  href="#"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-4",
                  )}
                >
                  <Settings className="mr-1.5 h-3.5 w-3.5" />
                  Open settings
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
