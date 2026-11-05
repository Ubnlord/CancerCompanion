import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/resources")({component:Page});
function Page(){return <div><PageHeader title="Resources" back="/admin"/><Card><p className="text-sm text-muted">Resource publishing is not enabled from this screen until admin authorization and audit logging are verified.</p></Card></div>}
