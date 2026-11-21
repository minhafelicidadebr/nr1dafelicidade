/**
 * Small compatibility layer that exposes the subset of the react-router API the
 * migrated pages use, implemented on top of TanStack Router.
 */
import * as React from "react";
import {
  Link as TsLink,
  Navigate as TsNavigate,
  Outlet,
  useLocation as useTsLocation,
  useNavigate as useTsNavigate,
  useParams as useTsParams,
  useRouter,
} from "@tanstack/react-router";

export { Outlet };

type To = string | { pathname?: string; search?: string; hash?: string };

function parseTo(to: To, currentPath: string) {
  let pathname = "";
  let search = "";
  let hash = "";
  if (typeof to === "string") {
    const hashIdx = to.indexOf("#");
    let rest = to;
    if (hashIdx >= 0) {
      hash = to.slice(hashIdx + 1);
      rest = to.slice(0, hashIdx);
    }
    const qIdx = rest.indexOf("?");
    if (qIdx >= 0) {
      search = rest.slice(qIdx + 1);
      rest = rest.slice(0, qIdx);
    }
    pathname = rest;
  } else {
    pathname = to.pathname ?? "";
    search = (to.search ?? "").replace(/^\?/, "");
    hash = (to.hash ?? "").replace(/^#/, "");
  }
  if (!pathname) pathname = currentPath;
  else if (!pathname.startsWith("/")) {
    const base = currentPath.endsWith("/") ? currentPath : currentPath + "/";
    pathname = new URL(pathname, "http://x" + base).pathname;
  }
  const searchObj = Object.fromEntries(new URLSearchParams(search).entries());
  return { pathname, search: searchObj, hash: hash || undefined };
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: To;
  replace?: boolean;
  state?: unknown;
  children?: React.ReactNode;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace, state: _state, ...rest },
  ref,
) {
  const loc = useTsLocation();
  const t = parseTo(to, loc.pathname);
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <TsLink ref={ref} {...(rest as any)} to={t.pathname as any} search={t.search as any} hash={t.hash} replace={replace} />
  );
});

export type NavLinkProps = Omit<LinkProps, "className" | "style" | "children"> & {
  end?: boolean;
  className?: string | ((s: { isActive: boolean; isPending: boolean }) => string | undefined);
  style?: React.CSSProperties | ((s: { isActive: boolean; isPending: boolean }) => React.CSSProperties | undefined);
  children?: React.ReactNode | ((s: { isActive: boolean; isPending: boolean }) => React.ReactNode);
};

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLink(
  { to, end, className, style, children, ...rest },
  ref,
) {
  const loc = useTsLocation();
  const target = parseTo(to, loc.pathname).pathname.replace(/\/$/, "") || "/";
  const current = loc.pathname.replace(/\/$/, "") || "/";
  const isActive = end ? current === target : current === target || current.startsWith(target === "/" ? "/__never" : target + "/");
  const s = { isActive, isPending: false };
  return (
    <Link
      ref={ref}
      to={to}
      {...rest}
      aria-current={isActive ? "page" : undefined}
      className={typeof className === "function" ? className(s) : className}
      style={typeof style === "function" ? style(s) : style}
    >
      {typeof children === "function" ? children(s) : children}
    </Link>
  );
});

export function useNavigate() {
  const navigate = useTsNavigate();
  const router = useRouter();
  return React.useCallback(
    (to: To | number, opts?: { replace?: boolean; state?: unknown }) => {
      if (typeof to === "number") {
        router.history.go(to);
        return;
      }
      const t = parseTo(to, router.state.location.pathname);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void navigate({ to: t.pathname as any, search: t.search as any, hash: t.hash, replace: opts?.replace });
    },
    [navigate, router],
  );
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (useTsParams as any)({ strict: false }) as T;
}

export function useLocation() {
  const loc = useTsLocation();
  return {
    pathname: loc.pathname,
    search: loc.searchStr ?? "",
    hash: loc.hash ? `#${loc.hash}` : "",
    state: loc.state as unknown,
    key: loc.state?.__TSR_key ?? "default",
  };
}

export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>), opts?: { replace?: boolean }) => void,
] {
  const loc = useTsLocation();
  const navigate = useTsNavigate();
  const params = React.useMemo(() => new URLSearchParams(loc.searchStr ?? ""), [loc.searchStr]);
  const set = React.useCallback(
    (
      next: URLSearchParams | Record<string, string> | ((prev: URLSearchParams) => URLSearchParams | Record<string, string>),
      opts?: { replace?: boolean },
    ) => {
      const value = typeof next === "function" ? next(new URLSearchParams(params)) : next;
      const sp = value instanceof URLSearchParams ? value : new URLSearchParams(value);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void navigate({ to: loc.pathname as any, search: Object.fromEntries(sp.entries()) as any, replace: opts?.replace });
    },
    [navigate, loc.pathname, params],
  );
  return [params, set];
}

export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  const loc = useTsLocation();
  const t = parseTo(to, loc.pathname);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TsNavigate to={t.pathname as any} search={t.search as any} hash={t.hash} replace={replace} />;
}
