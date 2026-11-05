import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/users")({component:Page});
function Page(){return <div><PageHeader title="Users" back="/admin"/><Card><p className="text-sm text-muted">User administration is intentionally read-only until role enforcement, privacy boundaries and audit logging are verified.</p></Card></div>}
