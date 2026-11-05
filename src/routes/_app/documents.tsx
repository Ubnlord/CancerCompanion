import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { useLoad } from "@/lib/use-load";
import { listDocuments } from "@/lib/server/life";
export const Route=createFileRoute("/_app/documents")({component:Page});
function Page(){const {data}=useLoad(()=>listDocuments(),[]);return <div><PageHeader title="Documents" back="/care"/><p className="mb-3 text-sm text-muted">Private records and notes associated with your account.</p>{data?.map(d=><Card key={d.id} className="mb-2"><p className="font-medium">{d.title}</p><p className="text-xs text-muted">{d.category} · {d.createdAt}</p><p className="text-sm">{d.description}</p></Card>)}</div>}
