import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { GuardianDisclaimer } from "@/components/disclaimer";
import { Button } from "@/components/ui/button";
import { getConversation, listConversations, sendGuardianMessage } from "@/lib/server/guardian";
import type { AiMessage } from "@/lib/types";

export const Route = createFileRoute("/_app/guardian")({ component: GuardianPage });
const PROMPTS = ["What does chemotherapy mean?", "Help me prepare questions for my doctor.", "Explain this medical term: neutropenia.", "What should I bring to my next appointment?"];

function GuardianPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => { void listConversations().then(async (list) => { if (list[0]) { setConversationId(list[0].id); setMessages(await getConversation({ data: list[0].id })); } }); }, []);
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);
  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true); setError(null); setDraft("");
    setMessages((m) => [...m, { id: \`local-\${Date.now()}\`, role: "user", content, createdAt: new Date().toISOString() }]);
    const result = await sendGuardianMessage({ data: { conversationId, message: content } });
    if (!result.ok) { setError(result.error); setBusy(false); return; }
    setConversationId(result.conversationId);
    setMessages(await getConversation({ data: result.conversationId }));
    setBusy(false);
  }
  return <div className="flex min-h-[70dvh] flex-col">
    <PageHeader title="Guardian" subtitle="Educational companion" /><GuardianDisclaimer />
    <div className="mt-3 flex-1 space-y-3">
      {messages.length === 0 && !busy ? <div className="grid gap-2">{PROMPTS.map((p) => <button key={p} type="button" onClick={() => void send(p)} className="rounded-[20px] border border-line bg-surface px-3.5 py-3 text-left text-sm dark:border-white/10 dark:bg-white/5">{p}</button>)}</div> : messages.map((m) => <div key={m.id} className={\`max-w-[92%] rounded-[22px] px-3.5 py-2.5 text-sm leading-relaxed \${m.role === "user" ? "ml-auto bg-teal text-white" : "bg-surface shadow-[var(--shadow-card)] dark:bg-white/8"}\`}>{m.content}</div>)}
      {busy ? <p className="text-sm text-muted">Guardian is thinking…</p> : null}
      {error ? <p className="text-sm text-coral-deep">{error}</p> : null}<div ref={bottom} />
    </div>
    <form className="sticky bottom-0 mt-3 flex gap-2 bg-paper pt-2 pb-1 dark:bg-[#101918]" onSubmit={(e) => { e.preventDefault(); void send(draft); }}>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask a general question" aria-label="Message Guardian" className="h-12 flex-1 rounded-[16px] border border-line bg-surface px-3.5 text-sm dark:border-white/12 dark:bg-white/5" />
      <Button type="submit" size="icon" aria-label="Send" disabled={busy}><Send className="size-4" /></Button>
    </form>
  </div>;
}
