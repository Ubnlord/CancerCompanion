import { createFileRoute, Link, Navigate, useRouteContext } from "@tanstack/react-router";
import { Calendar, Shield, HeartPulse } from "lucide-react";
import { CompanionMark } from "@/components/mark";
import { MedicalDisclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { sessionUser } = useRouteContext({ from: "__root__" });
  const { user, isPending } = useCurrentUserState();
  if (sessionUser || user) return <Navigate to="/home" />;

  return (
    <main className="app-stage">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-6 py-10">
        <div className="flex items-center gap-2">
          <CompanionMark />
          <span className="text-sm font-semibold tracking-tight">CancerCompanion</span>
        </div>
        <h1 className="mt-12 font-display text-[2.6rem] leading-[1.1] text-ink dark:text-white">
          Support for every step of the cancer journey.
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft dark:text-white/70">
          A calm place to keep appointments, medicines, symptoms, and questions —
          and to sit with an educational companion before you talk to your care
          team.
        </p>
        <div className="mt-8 flex min-h-[7.5rem] flex-col gap-3">
          {isPending ? (
            <div className="skeleton h-12 rounded-[16px]" aria-hidden="true" />
          ) : (
            <>
              <Link to="/signup">
                <Button className="w-full" size="lg">
                  Create an account
                </Button>
              </Link>
              <Link to="/login">
                <Button className="w-full" variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
            </>
          )}
        </div>
        <ul className="mt-12 space-y-4">
          {[
            {
              icon: Calendar,
              title: "Organize care",
              body: "Appointments, medicines, documents, and a treatment timeline — in one private companion.",
            },
            {
              icon: HeartPulse,
              title: "Track how you feel",
              body: "Daily check-ins, symptoms, and a journal. Supportive, never diagnostic.",
            },
            {
              icon: Shield,
              title: "Ask Guardian",
              body: "Plain-language explanations and help preparing questions. Not medical advice.",
            },
          ].map((item) => (
            <li key={item.title} className="flex gap-3 rounded-[24px] bg-surface/80 p-4 dark:bg-white/5">
              <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-teal-soft text-teal dark:bg-white/10">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-10">
          <MedicalDisclaimer />
        </div>
      </div>
    </main>
  );
}
