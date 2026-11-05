import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { asBool, asNumber, iso, nid } from "@/lib/utils";
import { audit, requireAdmin } from "./access";

export const adminOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  await audit(sql, context.userId, "admin.overview", "admin", null);
  const users = await sql\`select count(*)::int as n from profiles\`;
  const active = await sql\`select count(*)::int as n from profiles where updated_at > now() - interval '7 days'\`;
  const caregivers = await sql\`select count(*)::int as n from caregivers where status = 'active'\`;
  const subs = await sql\`select tier, count(*)::int as n from subscriptions where status = 'active' group by tier\`;
  const ai = await sql\`select count(*)::int as n from ai_messages where created_at > now() - interval '7 days'\`;
  const flags = await sql\`select count(*)::int as n from ai_messages where flagged = true\`;
  const settings = await sql\`select key, value from system_settings\`;
  return {
    totalUsers: asNumber(users[0]?.n), activeUsers: asNumber(active[0]?.n),
    caregivers: asNumber(caregivers[0]?.n),
    subscriptions: Object.fromEntries(subs.map((s) => [s.tier, asNumber(s.n)])),
    aiMessages7d: asNumber(ai[0]?.n), flaggedMessages: asNumber(flags[0]?.n),
    settings: Object.fromEntries(settings.map((s) => [s.key, s.value])),
  };
});

export const adminUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  await audit(sql, context.userId, "admin.users", "profiles", null);
  const rows = await sql\`select p.user_id, p.first_name, p.last_name, p.is_admin, p.created_at, u.email
    from profiles p left join "user" u on u.id = p.user_id order by p.created_at desc limit 200\`;
  return rows.map((r) => ({ userId: String(r.user_id), name: \`\${r.first_name ?? ""} \${r.last_name ?? ""}\`.trim() || "Member",
    email: r.email ? String(r.email) : "", isAdmin: asBool(r.is_admin), createdAt: iso(r.created_at) }));
});

export const adminSetUserAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware])
  .validator((input: { userId: string; isAdmin: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql(); await requireAdmin(sql, context.userId);
    await sql\`update profiles set is_admin = \${data.isAdmin} where user_id = \${data.userId}\`;
    await audit(sql, context.userId, "admin.set_admin", "profiles", data.userId, String(data.isAdmin));
  });

export const adminSubscriptions = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  const rows = await sql\`select s.*, p.first_name, p.last_name from subscriptions s left join profiles p on p.user_id = s.user_id order by s.created_at desc limit 200\`;
  return rows.map((r) => ({ id: String(r.id), userId: String(r.user_id), name: \`\${r.first_name ?? ""} \${r.last_name ?? ""}\`.trim(),
    tier: String(r.tier), status: String(r.status), createdAt: iso(r.created_at) }));
});

export const adminPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  const rows = await sql\`select * from payments order by created_at desc limit 200\`;
  return rows.map((r) => ({ id: String(r.id), userId: String(r.user_id), status: String(r.status),
    amount: r.amount == null ? null : asNumber(r.amount), currency: r.currency ? String(r.currency) : null,
    provider: String(r.provider), createdAt: iso(r.created_at) }));
});

export const adminResources = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  const rows = await sql\`select id, title, category, published, summary from support_resources order by title\`;
  return rows.map((r) => ({ id: String(r.id), title: String(r.title), category: String(r.category),
    published: Boolean(r.published), summary: String(r.summary) }));
});

export const adminSaveResource = createServerFn({ method: "POST" }).middleware([authMiddleware])
  .validator((input: { id?: string; title: string; category: string; summary: string; body: string; sourceLabel: string; published: boolean }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql(); await requireAdmin(sql, context.userId); const id = data.id || nid();
    if (data.id) await sql\`update support_resources set title = \${data.title}, category = \${data.category},
      summary = \${data.summary}, body = \${data.body}, source_label = \${data.sourceLabel}, published = \${data.published} where id = \${id}\`;
    else await sql\`insert into support_resources (id, title, category, summary, body, source_label, published)
      values (\${id}, \${data.title}, \${data.category}, \${data.summary}, \${data.body}, \${data.sourceLabel}, \${data.published})\`;
    await audit(sql, context.userId, "admin.resource", "support_resources", id); return { id };
  });

export const adminAiSafety = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  await audit(sql, context.userId, "admin.ai_safety", "ai_messages", null);
  const rows = await sql\`select id, user_id, role, left(content, 280) as excerpt, flagged, created_at
    from ai_messages where flagged = true order by created_at desc limit 100\`;
  return rows.map((r) => ({ id: String(r.id), userId: String(r.user_id), role: String(r.role),
    excerpt: String(r.excerpt), createdAt: iso(r.created_at) }));
});

export const adminAudit = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql(); await requireAdmin(sql, context.userId);
  const rows = await sql\`select * from audit_logs order by created_at desc limit 200\`;
  return rows.map((r) => ({ id: String(r.id), actorId: String(r.actor_id), action: String(r.action),
    resource: String(r.resource), resourceId: r.resource_id ? String(r.resource_id) : null,
    metadata: String(r.metadata ?? ""), createdAt: iso(r.created_at) }));
});

export const adminSaveSetting = createServerFn({ method: "POST" }).middleware([authMiddleware])
  .validator((input: { key: string; value: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql(); await requireAdmin(sql, context.userId);
    await sql\`insert into system_settings (key, value) values (\${data.key}, \${data.value})
      on conflict (key) do update set value = excluded.value\`;
    await audit(sql, context.userId, "admin.setting", "system_settings", data.key, data.value);
  });

export const adminBroadcast = createServerFn({ method: "POST" }).middleware([authMiddleware])
  .validator((input: { title: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql(); await requireAdmin(sql, context.userId);
    const users = await sql\`select user_id from profiles\`;
    for (const u of users) await sql\`insert into notifications (id, user_id, type, title, body)
      values (\${nid()}, \${u.user_id}, 'app', \${data.title}, \${data.body})\`;
    await audit(sql, context.userId, "admin.broadcast", "notifications", null, data.title);
    return { count: users.length };
  });
