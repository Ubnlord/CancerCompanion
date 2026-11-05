import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
export function MedicalDisclaimer({className}:{className?:string}){
 return <p className={cn("rounded-[18px] bg-paper-deep px-3.5 py-3 text-xs leading-relaxed text-ink-soft dark:bg-white/6 dark:text-white/65",className)}>CancerCompanion is a supportive organizer. It does not diagnose, prescribe, or replace a qualified healthcare professional. For emergencies, use local emergency services — this app does not provide emergency medical care.</p>;
}
export function GuardianDisclaimer(){
 return <div className="flex gap-2.5 rounded-[18px] border border-line/80 bg-surface px-3 py-2.5 text-xs leading-relaxed text-ink-soft dark:border-white/10 dark:bg-white/5 dark:text-white/70"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-teal"/><p>Guardian offers general educational information and help preparing questions. It is not medical advice, not a diagnosis, and not an emergency service.</p></div>;
}
