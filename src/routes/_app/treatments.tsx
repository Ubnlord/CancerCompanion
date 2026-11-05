import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { useLoad } from "@/lib/use-load";
import { listTreatments } from "@/lib/server/care";
import { useCareStore } from "@/lib/care-store";
export const Route=createFileRoute("/_app/treatments")({component:Page});
function Page(){const patientId=useCareStore(s=>s.viewingPatientId);const {data}=useLoad(()=>listTreatments({data:patientId}),[patientId]);return <div><PageHeader title="Treatment timeline" back="/care"/>{data?.length?data.map(t=><Card key={t.id} className="mb-2"><p className="font-medium">{t.title}</p><p className="text-sm text-muted">{t.type} · {t.status}</p><p className="text-sm">{t.startDate} — {t.endDate}</p><p className="text-sm">{t.notes}</p></Card>):<Card>No treatments recorded yet.</Card>}</div>}
