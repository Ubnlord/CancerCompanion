import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Label({className,...props}:React.LabelHTMLAttributes<HTMLLabelElement>){return <label className={cn("mb-1.5 block text-sm font-medium text-ink-soft dark:text-white/70",className)} {...props}/>;}
const fieldClass="h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-base text-ink outline-none transition-colors placeholder:text-muted focus:border-teal focus:ring-2 focus:ring-teal/20 dark:border-white/12 dark:bg-white/5 dark:text-white";
export function Input({className,...props}:InputHTMLAttributes<HTMLInputElement>){return <input className={cn(fieldClass,className)} {...props}/>;}
export function Textarea({className,...props}:TextareaHTMLAttributes<HTMLTextAreaElement>){return <textarea className={cn(fieldClass,"h-auto min-h-24 py-2.5 leading-relaxed",className)} {...props}/>;}
export function Select({className,children,...props}:React.SelectHTMLAttributes<HTMLSelectElement>){return <select className={cn(fieldClass,className)} {...props}>{children}</select>;}
export function FieldError({children}:{children?:string|null}){if(!children)return null;return <p className="mt-1 text-sm text-coral-deep">{children}</p>;}