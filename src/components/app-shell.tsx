import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, BookOpen, Calendar, ClipboardList, FileText, HeartPulse, Home, Leaf, Menu, PhoneCall, Pill, Settings, Shield, Users, Wallet, X } from "lucide-react";
import { CompanionMark } from "@/components/mark";
import { Sheet } from "@/components/ui/sheet";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { useCareStore } from "@/lib/care-store";
import { bootstrapAccount, getHomeData, listNotifications, markNotificationsRead } from "@/lib/server/account";
import { formatDateTime } from "@/lib/utils";
import type { NotificationItem } from "@/lib/types";

const TABS = [
  { to: "/home", label: "Home", icon: Home }, { to: "/care", label: "Care", icon: HeartPulse },
  { to: "/wellbeing", label: "Wellbeing", icon: Leaf }, { to: "/guardian", label: "Guardian", icon: Shield },
  { to: "/profile", label: "Profile", icon: Users },
] as const;
const MENU = [
  { to: "/appointments", label: "Appointments", icon: Calendar }, { to: "/medications", label: "Medications", icon: Pill },
  { to: "/symptoms", label: "Symptoms", icon: ClipboardList }, { to: "/treatments", label: "Treatment timeline", icon: HeartPulse },
  { to: "/documents", label: "Documents", icon: FileText }, { to: "/caregivers", label: "Caregivers", icon: Users },
  { to: "/emergency", label: "Emergency", icon: PhoneCall }, { to: "/expenses", label: "Expenses", icon: Wallet },
  { to: "/resources", label: "Support resources", icon: BookOpen }, { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const user = useCurrentUser();
  const viewing = useCareStore((s) => s.viewingPatientId);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notes, setNotes] = useState<NotificationItem[]>([]);
  const [patientName, setPatientName] = useState<string | null>(null);

  useEffect(() => {
    void bootstrapAccount().catch(() => undefined);
    void getHomeData({ data: viewing }).then((d) => {
      setUnread(d.unreadNotifications);
      if (viewing) {
        const p = d.linkedPatients.find((x) => x.patientId === viewing);
        setPatientName(p?.patientName ?? "Someone you support");
      } else setPatientName(null);
    }).catch(() => undefined);
  }, [pathname, viewing]);

  async function openNotes() {
    setNotesOpen(true);
    const items = await listNotifications();
    setNotes(items);
    setUnread(0);
    await markNotificationsRead();
  }

  return <div className="app-stage"><div className="app-device flex flex-col">
    <header className="flex items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)} className="grid size-11 place-items-center rounded-[14px] text-ink hover:bg-paper-deep dark:text-white dark:hover:bg-white/8"><Menu className="size-5" /></button>
      <CompanionMark className="size-8" />
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold tracking-tight text-ink dark:text-white">CancerCompanion</p><p className="truncate text-[11px] text-muted">{patientName ? `Supporting ${patientName}` : "Support for every step"}</p></div>
      <button type="button" aria-label="Notifications" onClick={() => void openNotes()} className="relative grid size-11 place-items-center rounded-[14px] text-ink hover:bg-paper-deep dark:text-white dark:hover:bg-white/8"><Bell className="size-5" />{unread > 0 ? <span className="absolute top-2 right-2 size-2 rounded-full bg-coral" /> : null}</button>
    </header>
    {patientName ? <div className="mx-4 mb-1 rounded-[14px] bg-blue-soft px-3 py-2 text-xs text-ink-soft dark:bg-blue/20 dark:text-white/80">You are viewing shared care information with permission. <button type="button" className="font-medium text-teal underline-offset-2 hover:underline" onClick={() => useCareStore.getState().setViewingPatientId(null)}>Back to my companion</button></div> : null}
    <main className="tab-safe min-h-0 flex-1 overflow-y-auto px-4 pt-1">{children ?? <Outlet />}</main>
    <nav aria-label="Primary" className="absolute inset-x-0 bottom-0 z-20 border-t border-line/80 bg-surface/95 px-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-md dark:border-white/10 dark:bg-[#141c1b]/95"><ul className="grid grid-cols-5">{TABS.map((tab) => { const active = pathname === tab.to || pathname.startsWith(`${tab.to}/`); const Icon = tab.icon; return <li key={tab.to}><Link to={tab.to} aria-current={active ? "page" : undefined} className={`flex h-14 flex-col items-center justify-center gap-0.5 rounded-[14px] text-[11px] font-medium ${active ? "text-teal dark:text-teal-soft" : "text-muted hover:text-ink dark:hover:text-white"}`}><Icon className="size-5" strokeWidth={active ? 2.2 : 1.75} />{tab.label}</Link></li>; })}</ul></nav>
  </div>
  {menuOpen ? <div className="fixed inset-0 z-40 mx-auto flex max-w-[430px] md:max-h-[calc(100dvh-48px)] md:max-w-[430px] md:self-center"><button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink/40" onClick={() => setMenuOpen(false)} /><aside className="relative z-10 flex h-full w-[86%] max-w-xs flex-col bg-paper pt-[max(1rem,env(safe-area-inset-top))] shadow-[var(--shadow-float)] dark:bg-[#141c1b]"><div className="flex items-center justify-between px-4 pb-3"><div className="flex items-center gap-2"><CompanionMark className="size-8" /><div><p className="text-sm font-semibold">Menu</p><p className="text-xs text-muted">{user?.displayName ?? user?.primaryEmail}</p></div></div><button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)} className="grid size-10 place-items-center rounded-[12px] hover:bg-paper-deep dark:hover:bg-white/8"><X className="size-5" /></button></div><nav className="flex-1 overflow-y-auto px-2 pb-8">{MENU.map((item) => { const Icon = item.icon; return <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)} className="flex h-12 items-center gap-3 rounded-[16px] px-3 text-sm font-medium text-ink hover:bg-paper-deep dark:text-white dark:hover:bg-white/8"><Icon className="size-5 text-teal" />{item.label}</Link>; })}</nav></aside></div> : null}
  <Sheet open={notesOpen} onOpenChange={setNotesOpen} title="Notifications"><p className="mb-3 text-xs text-muted">Previews never include clinical details such as diagnoses, doses, or test results.</p>{notes.length === 0 ? <p className="py-8 text-center text-sm text-muted">You are all caught up.</p> : <ul className="space-y-2">{notes.map((n) => <li key={n.id} className="rounded-[18px] border border-line/80 bg-surface px-3.5 py-3 dark:border-white/10 dark:bg-white/5"><p className="text-sm font-medium">{n.title}</p><p className="mt-0.5 text-sm text-ink-soft dark:text-white/70">{n.body}</p><p className="mt-1 text-[11px] text-muted">{formatDateTime(n.createdAt)}</p></li>)}</ul>}</Sheet>
  </div>;
}