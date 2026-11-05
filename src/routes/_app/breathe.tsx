import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_app/breathe")({ component: BreathePage });

function BreathePage() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center text-center">
      <PageHeader title="Breathing" back="/wellbeing" />
      <p className="mb-8 max-w-xs text-sm text-muted">
        A quiet paced breath. If anything feels unwell, stop and rest. This is not medical treatment.
      </p>
      <div className="breath-orb" aria-hidden="true" />
      <p className="mt-8 font-display text-2xl text-teal">Inhale · hold · exhale</p>
      <p className="mt-2 text-sm text-muted">Follow the circle. About four seconds in, a pause, a longer out.</p>
    </div>
  );
}
