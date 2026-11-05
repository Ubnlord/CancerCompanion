import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { listResources } from "@/lib/server/life";
import { useLoad } from "@/lib/use-load";
import type { SupportResource } from "@/lib/types";

export const Route = createFileRoute("/_app/resources")({ component: ResourcesPage });
function ResourcesPage() {
  const { data } = useLoad(() => listResources(), []);
  const [open, setOpen] = useState<SupportResource | null>(null);
  return <div>
    <PageHeader title="Support resources" subtitle="General education — not personal advice" />
    <MedicalDisclaimer className="mb-3" />
    <ul className="space-y-2">{data?.map((r) => <li key={r.id}>
      <button type="button" className="w-full text-left" onClick={() => setOpen(r)}>
        <Card><p className="text-xs uppercase tracking-wider text-muted">{r.category}</p><p className="font-medium">{r.title}</p><p className="mt-1 text-sm text-muted">{r.summary}</p></Card>
      </button>
    </li>)}</ul>
    {open ? <div className="fixed inset-0 z-40 mx-auto flex max-w-[430px] items-end bg-ink/40 md:items-center">
      <div className="max-h-[88dvh] w-full overflow-y-auto rounded-t-[28px] bg-paper p-5 dark:bg-[#141c1b]">
        <p className="text-xs uppercase text-muted">{open.sourceLabel}</p><h2 className="mt-1 font-display text-2xl">{open.title}</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft dark:text-white/75">{open.body}</p>
        <button type="button" className="mt-5 h-11 w-full rounded-[14px] bg-teal text-sm font-medium text-white" onClick={() => setOpen(null)}>Close</button>
      </div>
    </div> : null}
  </div>;
}
