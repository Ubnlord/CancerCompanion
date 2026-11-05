import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/reports")({component:Page});
function Page(){return <div><PageHeader title="Reports" back="/admin"/><Card><p className="text-sm text-muted">Aggregate reports will appear here after the reporting queries are connected and verified.</p></Card></div>}
