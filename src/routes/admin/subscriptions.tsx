import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/subscriptions")({component:Page});
function Page(){return <div><PageHeader title="Subscriptions" back="/admin"/><Card><p className="text-sm text-muted">Subscription changes are disabled until verified payment events and entitlement checks are connected.</p></Card></div>}
