import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/system")({component:Page});
function Page(){return <div><PageHeader title="System status" back="/admin"/><Card><p className="text-sm text-muted">System health checks are not yet wired to live infrastructure telemetry.</p></Card></div>}
