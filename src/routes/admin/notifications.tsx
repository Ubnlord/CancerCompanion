import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/notifications")({component:Page});
function Page(){return <div><PageHeader title="Notifications" back="/admin"/><Card><p className="text-sm text-muted">Administrative notification delivery is not yet connected. No notification is sent from this placeholder.</p></Card></div>}
