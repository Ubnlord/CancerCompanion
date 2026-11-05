import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Sun, Wind } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { listJournal, listWellbeing, saveWellbeing } from "@/lib/server/life";
import { useLoad } from "@/lib/use-load";
import { todayISODate } from "@/lib/utils";

export const Route = createFileRoute("/_app/wellbeing")({ component: WellbeingPage });
const MOODS = ["Very low", "Low", "Okay", "Good", "Bright"];

function WellbeingPage() {
  const { data: entries, reload } = useLoad(() => listWellbeing(), []);
  const { data: journal } = useLoad(() => listJournal(), []);
  const today = todayISODate();
  const existing = entries?.find((e) => e.entryDate === today);
  const [mood, setMood] = useState(existing?.mood ?? 3);
  const [energy, setEnergy] = useState(existing?.energy ?? 3);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [saved, setSaved] = useState(false);

  return <div>
    <PageHeader title="Wellbeing" subtitle="Supportive check-ins only — never a diagnosis." />
    <Card>
      <div className="flex items-center gap-2 text-teal"><Sun className="size-5" /><p className="font-medium text-ink dark:text-white">Daily check-in</p></div>
      <p className="mt-3 text-sm text-muted">Mood</p>
      <div className="mt-1 flex gap-1.5">{MOODS.map((label, i) => <button key={label} type="button" aria-label={label} onClick={() => setMood(i + 1)} className={\`h-11 flex-1 rounded-[14px] text-xs font-medium \${mood === i + 1 ? "bg-teal text-white" : "bg-paper-deep text-ink-soft dark:bg-white/8 dark:text-white/70"}\`}>{i + 1}</button>)}</div>
      <p className="mt-3 text-sm text-muted">Energy</p>
      <input type="range" min={1} max={5} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="mt-2 w-full accent-teal" aria-label="Energy" />
      <Textarea className="mt-3" placeholder="Optional note — for you, not a medical record" value={notes} onChange={(e) => setNotes(e.target.value)} />
      <Button className="mt-3 w-full" onClick={async () => { await saveWellbeing({ data: { entryDate: today, mood, energy, notes } }); setSaved(true); reload(); }}>{saved || existing ? "Update check-in" : "Save check-in"}</Button>
    </Card>
    <div className="mt-3 grid grid-cols-2 gap-2">
      <Link to="/breathe"><Card className="h-28"><Wind className="size-5 text-teal" /><p className="mt-2 font-medium">Breathing</p><p className="text-xs text-muted">A quiet paced breath</p></Card></Link>
      <Link to="/relax"><Card className="h-28"><Sun className="size-5 text-teal" /><p className="mt-2 font-medium">Relaxation</p><p className="text-xs text-muted">A short body scan</p></Card></Link>
    </div>
    <Link to="/journal" className="mt-3 block"><Card><div className="flex items-center gap-2"><BookOpen className="size-5 text-teal" /><p className="font-medium">Journal</p></div><p className="mt-1 text-sm text-muted">{journal && journal.length > 0 ? \`\${journal.length} entries — private to you\` : "A private space for whatever you need to put down"}</p></Card></Link>
  </div>;
}
