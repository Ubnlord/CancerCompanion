import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { useLoad } from "@/lib/use-load";
import { listExpenses } from "@/lib/server/life";
export const Route=createFileRoute("/_app/expenses")({component:Page});
function Page(){const {data}=useLoad(()=>listExpenses(),[]);return <div><PageHeader title="Expenses" back="/home"/><p className="mb-3 text-sm text-muted">Keep track of care-related costs. This is a personal record, not financial advice.</p>{data?.map(e=><Card key={e.id} className="mb-2"><p className="font-medium">{e.description}</p><p className="text-sm text-muted">{e.category} · {e.currency} {e.amount}</p><p className="text-xs text-muted">{e.expenseDate}</p></Card>)}</div>}
