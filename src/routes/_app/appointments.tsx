import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingBlock } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { useCareStore } from "@/lib/care-store";
import { deleteAppointment, listAppointments, saveAppointment } from "@/lib/server/care";
import { useLoad } from "@/lib/use-load";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

export const Route = createFileRoute("/_app/appointments")({ component: AppointmentsPage });
const empty = { doctorName: "", hospital: "", type: "Follow-up", startsAt: "", notes: "", questions: "", status: "scheduled" as Appointment["status"] };

function AppointmentsPage() {
  const patientId = useCareStore((s) => s.viewingPatientId);
  const { data, loading, reload } = useLoad(() => listAppointments({ data: patientId }), [patientId]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...empty, id: undefined as string | undefined });
  function edit(a?: Appointment) {
    if (a) setForm({ id: a.id, doctorName: a.doctorName, hospital: a.hospital, type: a.type, startsAt: a.startsAt.slice(0, 16), notes: a.notes, questions: a.questions, status: a.status });
    else setForm({ ...empty, id: undefined });
    setOpen(true);
  }
  if (loading && !data) return <LoadingBlock />;
  return <div>
    <PageHeader title="Appointments" back="/care" action={<Button size="icon" aria-label="Add appointment" onClick={() => edit()}><CalendarPlus className="size-5" /></Button>} />
    {!data?.length ? <EmptyState icon={CalendarPlus} title="No appointments yet" body="Add the next visit and keep questions ready." action={<Button onClick={() => edit()}>Add appointment</Button>} /> :
      <ul className="space-y-2">{data.map((a) => <li key={a.id}><button type="button" className="w-full text-left" onClick={() => edit(a)}><Card><p className="text-xs uppercase tracking-wider text-muted">{a.status}</p><p className="font-medium">{a.doctorName}</p><p className="text-sm text-muted">{a.type} · {formatDateTime(a.startsAt)}</p>{a.hospital ? <p className="text-sm text-muted">{a.hospital}</p> : null}</Card></button></li>)}</ul>}
    <Sheet open={open} onOpenChange={setOpen} title={form.id ? "Appointment" : "New appointment"}>
      <form className="space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        await saveAppointment({ data: { id: form.id, patientId, doctorName: form.doctorName, hospital: form.hospital, type: form.type, startsAt: new Date(form.startsAt).toISOString(), notes: form.notes, questions: form.questions, status: form.status } });
        setOpen(false); reload();
      }}>
        <div><Label>Doctor</Label><Input required value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })} /></div>
        <div><Label>Hospital / clinic</Label><Input value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} /></div>
        <div><Label>Type</Label><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["Follow-up", "Consultation", "Infusion", "Scan", "Bloods", "Surgery", "Other"].map((t) => <option key={t}>{t}</option>)}</Select></div>
        <div><Label>Date and time</Label><Input type="datetime-local" required value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} /></div>
        <div><Label>Status</Label><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Appointment["status"] })}><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></Select></div>
        <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
        <div><Label>Questions for the doctor</Label><Textarea value={form.questions} onChange={(e) => setForm({ ...form, questions: e.target.value })} /></div>
        <Button type="submit" className="w-full">Save</Button>
        {form.id ? <Button type="button" variant="danger" className="w-full" onClick={async () => { await deleteAppointment({ data: { id: form.id!, patientId } }); setOpen(false); reload(); }}>Delete</Button> : null}
      </form>
    </Sheet>
  </div>;
}
