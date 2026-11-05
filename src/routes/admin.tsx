import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrapAccount } from "@/lib/server/account";
import { useLoad } from "@/lib/use-load";
import { CompanionMark } from "@/components/mark";

export const Route = createFileRoute("/admin")({ component: AdminLayout });
const LINKS = [
  { to: "/admin", label: "Overview" }, { to: "/admin/users", label: "Users" },
  { to: "/admin/subscriptions", label: "Subscriptions" }, { to: "/admin/payments", label: "Payments" },
  { to: "/admin/resources", label: "Resources" }, { to: "/admin/safety", label: "AI safety" },
  { to: "/admin/notifications", label: "Notifications" }, { to: "/admin/reports", label: "Reports" },
  { to: "/admin/audit", label: "Audit logs" }, { to: "/admin/system", label: "System" },
] as const;

function AdminLayout() {
  const { user, isPending } = useCurrentUserState();
  const { data: profile, loading } = useLoad(() => bootstrapAccount(), []);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (isPending || loading) return <main className="grid min-h-dvh place-items-center bg-paper"><div className="skeleton h-24 w-64 rounded-[24px]" /></main>;
  if (!user) return <RedirectToSignIn />;
  if (profile && !profile.isAdmin) return <main className="grid min-h-dvh place-items-center bg-paper px-6 text-center"><div><h1 className="font-display text-2xl">Admin access required</h1><p className="mt-2 text-sm text-muted">This area is for authorized operators. Medical records are not shown here by default.</p><Link to="/home" className="mt-4 inline-block text-teal">Return to companion</Link></div></main>;
  return <div className="min-h-dvh bg-paper text-ink dark:bg-[#0b1211] dark:text-white"><div className="mx-auto flex max-w-5xl flex-col md:flex-row"><aside className="border-b border-line p-4 md:min-h-dvh md:w-56 md:border-r md:border-b-0 dark:border-white/10"><div className="mb-4 flex items-center gap-2"><CompanionMark className="size-7" /><span className="text-sm font-semibold">Admin</span></div><nav className="flex gap-2 overflow-x-auto md:flex-col">{LINKS.map((l) => <Link key={l.to} to={l.to} className={\`whitespace-nowrap rounded-[12px] px-3 py-2 text-sm \${pathname === l.to ? "bg-teal text-white" : "hover:bg-paper-deep dark:hover:bg-white/8"}\`}>{l.label}</Link>)}</nav><Link to="/home" className="mt-6 hidden text-sm text-teal md:inline-block">Back to app</Link></aside><main className="flex-1 p-5"><Outlet /></main></div></div>;
}
