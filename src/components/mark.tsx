import { cn } from "@/lib/utils";
export function CompanionMark({className,title="CancerCompanion"}:{className?:string;title?:string}){
 return <svg viewBox="0 0 32 32" className={cn("size-8",className)} role="img" aria-label={title}><title>{title}</title><rect width="32" height="32" rx="10" fill="#0B6B63"/><path d="M8.5 19.5c0-5.2 3.6-9 7.8-9 2.4 0 4.5 1.1 5.8 2.9" fill="none" stroke="#F6F3EE" strokeWidth="2.2" strokeLinecap="round"/><path d="M10.2 21.2c1.3 2.1 3.5 3.4 6.1 3.4 4.2 0 7.8-3.8 7.8-9" fill="none" stroke="#D4785C" strokeWidth="2.2" strokeLinecap="round"/><circle cx="16.2" cy="16.2" r="2.15" fill="#F6F3EE"/></svg>;
}
