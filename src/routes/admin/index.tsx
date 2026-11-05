import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { adminOverview } from "@/lib/server/admin";
import { useLoad } from "@/lib/use-load";

export const Route = createFileRoute("/admin/")({ component: AdminHome });
function AdminHome() {
  const { data, error } = useLoad(() => adminOverview(), []);
  if (error) return <p className="text-sm text-coral-deep">{error}</p>;
  if (!data) return <div className="skeleton h-40 rounded-[24px]" />;
  const tiles = [["People", data.totalUsers], ["Active (7d)", data.activeUsers], ["Caregivers", data.caregivers], ["Guardian msgs (7d)", data.aiMessages7d], ["Flagged", data.flaggedMessages], ["Plus", data.subscriptions.plus ?? 0]];
  return <div><h1 className="font-display text-3xl">Overview</h1><p className="mt-1 text-sm text-muted">Metrics only. Private medical records are not listed here.</p><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">{tiles.map(([label, value]) => <Card key={String(label)}><p className="text-xs uppercase text-muted">{label}</p><p className="mt-1 font-display text-3xl tabular-nums">{value}</p></Card>)}</div><p className="mt-6 text-sm text-muted">System: Guardian {data.settings.ai_enabled === "true" ? "on" : "off"} · maintenance {data.settings.maintenance_mode}</p></div>;
}
