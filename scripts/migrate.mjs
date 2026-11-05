#!/usr/bin/env node
/**
 * Deploy-time database migrator. Run explicitly after configuring DATABASE_URL.
 * Each migration is transactional and recorded to avoid repeat application.
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import pg from "pg";
import { pendingMigrations } from "./migration-plan.mjs";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.log("[migrate] DATABASE_URL not set — skipping.");
  process.exit(0);
}
const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");
async function main() {
  const entries = await readdir(migrationsDir);
  const pending = pendingMigrations(entries, []);
  if (!pending.length) { console.log("[migrate] no migrations."); return; }
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    await client.query("CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())");
    const applied = (await client.query("SELECT name FROM _migrations")).rows.map((r) => r.name);
    for (const { name } of pendingMigrations(entries, applied)) {
      const sql = await readFile(join(migrationsDir, name), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [name]);
        await client.query("COMMIT");
        console.log("[migrate] applied", name);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally { client.release(); await pool.end(); }
}
main().catch((error) => { console.error("[migrate] failed", error); process.exit(1); });
