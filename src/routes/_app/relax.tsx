import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/relax")({ component: RelaxPage });

const STEPS = [
  "Let your shoulders drop away from your ears.",
  "Unclench your jaw. Rest your tongue.",
  "Feel the weight of your hands.",
  "Soften your belly as you breathe out.",
  "Notice your legs on the chair or bed.",
  "If thoughts arrive, let them pass without chasing them.",
  "Take one slower breath than the last.",
  "When you are ready, open your eyes and look around the room.",
];

function RelaxPage() {
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % STEPS.length), 12000);
    return () => window.clearInterval(t);
  }, [running]);

  return (
    <div className="flex min-h-[70dvh] flex-col">
      <PageHeader title="Relaxation" back="/wellbeing" />
      <p className="text-sm text-muted">A short body scan. Supportive only — stop whenever you like.</p>
      <div className="mt-10 flex-1">
        <p className="text-xs uppercase tracking-wider text-muted">Step {i + 1} of {STEPS.length}</p>
        <p className="mt-3 font-display text-3xl leading-snug">{STEPS[i]}</p>
      </div>
      <Button className="w-full" onClick={() => setRunning((v) => !v)}>
        {running ? "Pause" : "Begin"}
      </Button>
    </div>
  );
}
