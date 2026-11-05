import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/audit")({component:Page});
function Page(){return <div><PageHeader title="Audit log" back="/admin"/><Card><p className="text-sm text-muted">Audit records are retained server-side. This view is being connected to the protected audit endpoint.</p></Card></div>}
