import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/payments/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.PAYMENT_WEBHOOK_SECRET;
        const supplied = request.headers.get("x-webhook-secret");
        if (!secret || !supplied || supplied !== secret) {
          return new Response("unauthorized", { status: 401 });
        }
        const sql = await getSql();
        const raw = await request.text();
        let payload: Record<string, unknown>;
        try { payload = JSON.parse(raw) as Record<string, unknown>; }
        catch { return new Response("invalid json", { status: 400 }); }
        const eventId = String(payload.id ?? payload.event_id ?? "");
        if (!eventId) return new Response("missing event id", { status: 400 });
        const existing = await sql<{ id: string }>`select id from payments where provider_event_id = ${eventId} limit 1`;
        if (existing[0]) return Response.json({ ok: true, duplicate: true });
        const userId = String(payload.user_id ?? payload.userId ?? "");
        const status = String(payload.status ?? "received");
        const amount = typeof payload.amount === "number" ? payload.amount : null;
        const currency = payload.currency ? String(payload.currency) : null;
        const subId = payload.subscription_id ? String(payload.subscription_id) : null;
        await sql`insert into payments (id, user_id, subscription_id, provider, provider_event_id, amount, currency, status, raw_payload)
          values (${crypto.randomUUID()}, ${userId}, ${subId}, 'webhook', ${eventId}, ${amount}, ${currency}, ${status}, ${raw})`;
        // Entitlements are intentionally NOT activated by an unverified client payload.
        return Response.json({ ok: true });
      },
    },
  },
});
