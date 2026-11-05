import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
export const Route=createFileRoute("/admin/payments")({component:Page});
function Page(){return <div><PageHeader title="Payments" back="/admin"/><Card><p className="text-sm text-muted">No payment actions are enabled. Payment records must be verified against a trusted payment provider before displaying or changing financial status.</p></Card></div>}
