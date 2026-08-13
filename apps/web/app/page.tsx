import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      title: "Secure by default",
      description:
        "HTTP-only session cookies, bcrypt password hashing, and strict input validation on every field.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Fast full-stack",
      description:
        "NestJS REST API on the backend, Next.js App Router on the frontend — both type-safe end to end.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "Great UX out of the box",
      description:
        "Password strength meters, inline validation, accessible forms and instant client-side checks.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary/30 to-primary/10 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Nest + Next + Turbo
              </div>
              <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                A production-ready auth starter
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                Sign up and sign in flows with real-time validation, secure
                sessions, and a beautiful UI. Built on a type-safe monorepo
                powered by Prisma, NestJS, and Next.js App Router.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href="/auth/signup"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Create an account
                </Link>
                <Link
                  href="/auth/signin"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                  )}
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Everything you need to get started
            </h2>
            <p className="mt-4 text-muted-foreground">
              Stop rebuilding auth from scratch every time. Focus on the
              features that make your product unique.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-border">
                  {f.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nest Next Turbo. Built with Prisma,
            NestJS &amp; Next.js.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/auth/signin"
              className="hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="hover:text-foreground transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
