import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/safety")({component:Page});
function Page(){return <div><PageHeader title="Safety" back="/admin"/><Card><p className="text-sm text-muted">Safety controls and incident review require verified privileged access. No medical records are exposed here.</p></Card></div>}
