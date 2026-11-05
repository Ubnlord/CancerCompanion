import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { useLoad } from "@/lib/use-load";
import { listSymptoms,saveSymptom } from "@/lib/server/care";
import { useCareStore } from "@/lib/care-store";
export const Route=createFileRoute("/_app/symptoms")({component:Page});
function Page(){const patientId=useCareStore(s=>s.viewingPatientId);const {data,reload}=useLoad(()=>listSymptoms({data:patientId}),[patientId]);const [pain,setPain]=useState(0);const [fatigue,setFatigue]=useState(0);const [notes,setNotes]=useState("");return <div><PageHeader title="Symptoms" back="/care"/><p className="text-sm text-muted">Track how you feel to discuss with your care team. This is not a diagnosis.</p><Card><label className="block text-sm">Pain: {pain}/10<input className="w-full" type="range" min="0" max="10" value={pain} onChange={e=>setPain(+e.target.value)}/></label><label className="mt-3 block text-sm">Fatigue: {fatigue}/10<input className="w-full" type="range" min="0" max="10" value={fatigue} onChange={e=>setFatigue(+e.target.value)}/></label><Textarea className="mt-3" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes"/><Button className="mt-3 w-full" onClick={async()=>{await saveSymptom({data:{patientId,pain,fatigue,notes}});setNotes("");reload();}}>Save symptom log</Button></Card><ul className="mt-3 space-y-2">{data?.map(s=><li key={s.id}><Card><p className="text-xs text-muted">{s.loggedAt}</p><p>Pain {s.pain} · Fatigue {s.fatigue}</p><p className="text-sm">{s.notes}</p></Card></li>)}</ul></div>}
