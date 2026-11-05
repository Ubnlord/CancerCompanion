import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ClipboardList, FileText, HeartPulse, Pill } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_app/care")({ component: CarePage });
const ITEMS = [
  { to: "/appointments", title: "Appointments", body: "Doctors, hospitals, and questions to take with you.", icon: Calendar },
  { to: "/medications", title: "Medications", body: "A list and log. The app never changes a prescribed instruction.", icon: Pill },
  { to: "/treatments", title: "Treatment timeline", body: "Courses and visits you want to remember.", icon: HeartPulse },
  { to: "/symptoms", title: "Symptoms", body: "Pain, fatigue, mood, and more — for you and your team.", icon: ClipboardList },
  { to: "/documents", title: "Document vault", body: "Private reports and letters, stored for you only.", icon: FileText },
];
function CarePage() {
  return <div>
    <PageHeader title="Care" subtitle="The practical side of the journey, kept in one place." />
    <ul className="space-y-2.5">{ITEMS.map((item) => <li key={item.to}>
      <Link to={item.to} className="flex gap-3 rounded-[24px] border border-line/80 bg-surface p-4 shadow-[var(--shadow-card)] dark:border-white/8 dark:bg-white/5">
        <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-teal-soft text-teal dark:bg-white/10"><item.icon className="size-5" /></span>
        <div><p className="font-medium">{item.title}</p><p className="mt-0.5 text-sm leading-relaxed text-muted">{item.body}</p></div>
      </Link>
    </li>)}</ul>
  </div>;
}
