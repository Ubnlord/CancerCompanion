import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/field";
import { deleteJournal, listJournal, saveJournal } from "@/lib/server/life";
import { useLoad } from "@/lib/use-load";
import { formatDateTime } from "@/lib/utils";

export const Route = createFileRoute("/_app/journal")({ component: JournalPage });
function JournalPage() {
  const { data, reload } = useLoad(() => listJournal(), []);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  return <div>
    <PageHeader title="Journal" back="/wellbeing" />
    <form className="space-y-2" onSubmit={async (e) => {
      e.preventDefault();
      if (!body.trim()) return;
      await saveJournal({ data: { title, body } });
      setTitle(""); setBody(""); reload();
    }}>
      <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea required placeholder="A private page. Write whatever you need." value={body} onChange={(e) => setBody(e.target.value)} />
      <Button type="submit" className="w-full">Save entry</Button>
    </form>
    <div className="mt-4 space-y-2">{!data?.length
      ? <EmptyState icon={BookOpen} title="No entries yet" body="This journal stays on your account." />
      : data.map((j) => <Card key={j.id}>
        <p className="text-xs text-muted">{formatDateTime(j.createdAt)}</p>
        {j.title ? <p className="font-medium">{j.title}</p> : null}
        <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{j.body}</p>
        <button type="button" className="mt-2 text-xs text-coral-deep" onClick={() => void deleteJournal({ data: j.id }).then(reload)}>Delete</button>
      </Card>)}</div>
  </div>;
}
