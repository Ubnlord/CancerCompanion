import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Card({className,...props}:HTMLAttributes<HTMLDivElement>){return <div className={cn("rounded-[28px] border border-line/80 bg-surface p-4 shadow-[var(--shadow-card)] dark:border-white/8 dark:bg-white/5",className)} {...props}/>;}