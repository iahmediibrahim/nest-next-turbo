import { redirect } from "next/navigation";
import { getSession, type Session } from "./session";
import {
  DEFAULT_AUTH_URL,
  DEFAULT_AFTER_LOGIN_URL,
} from "./sessionTokens";

type WithAuthOptions = {
  redirectTo?: string;
  preserveNext?: boolean;
};

export function withAuth<P extends object>(
  PageComponent: React.ComponentType<P & { session: Session }>,
  options: WithAuthOptions = {}
) {
  const { redirectTo = DEFAULT_AUTH_URL } = options;

  async function WrappedPage(props: P) {
    const session = await getSession();
    if (!session?.user) {
      redirect(redirectTo);
    }
    return <PageComponent {...(props as P)} session={session} />;
  }

  WrappedPage.displayName = `withAuth(${
    PageComponent.displayName || PageComponent.name || "Page"
  })`;

  return WrappedPage;
}

type WithGuestOptions = {
  redirectTo?: string;
};

export function withGuest<P extends object>(
  PageComponent: React.ComponentType<P>,
  options: WithGuestOptions = {}
) {
  const { redirectTo = DEFAULT_AFTER_LOGIN_URL } = options;

  async function WrappedPage(props: P) {
    const session = await getSession();
    if (session?.user) {
      redirect(redirectTo);
    }
    return <PageComponent {...(props as P)} />;
  }

  WrappedPage.displayName = `withGuest(${
    PageComponent.displayName || PageComponent.name || "Page"
  })`;

  return WrappedPage;
}
