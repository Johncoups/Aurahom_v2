# Supabase MCP Server

## What it is

An **MCP (Model Context Protocol)** server that exposes your Supabase database to Cursor so the AI can inspect schema and data during conversations.

## What the AI can do when connected

When the Supabase MCP is running and configured in Cursor, the AI can:

| Tool | Purpose |
|------|--------|
| **list_tables** | List all tables in the `public` schema |
| **get_table_schema** | Get column names, types, nullability for a table |
| **get_table_data** | Read rows from a table (with optional limit, default 10) |
| **count_table_rows** | Count rows in a table |
| **query_database** | Run **SELECT-only** SQL (requires `exec_sql` RPC in Supabase) |

Useful for: answering “what tables exist?”, “what’s the schema of `vendors`?”, “show me sample data”, “how many bid_requests?”, and writing correct queries/code against your real schema.

## How to run it

1. **Env**  
   In `.env.local` set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (recommended so the MCP can read all tables; anon key is restricted by RLS)

2. **Start with the app**  
   ```bash
   npm run dev
   ```  
   This runs both Next.js and the MCP (`npm run mcp:supabase`).

3. **Start MCP only**  
   ```bash
   npm run mcp:supabase
   ```

4. **Cursor MCP config**  
   Cursor should use `mcp-config.json` so the `supabase` MCP server is started with the env above. If you use Cursor’s MCP settings, point it at this config or add the `supabase` server with the same `command` / `args` / `env`.

## Leveraging it more easily

- **Keep it running**  
  Use `npm run dev` while building so the AI can call list_tables / get_table_schema / get_table_data when you ask about the DB.

- **Ask explicitly**  
  e.g. “List tables in Supabase”, “What’s the schema of `bid_requests`?”, “Show 5 rows from `vendors`.” The AI will use the MCP tools when they’re available.

- **SELECT-only (query_database)**  
  The **query_database** tool only runs `SELECT`. It uses Supabase RPC `exec_sql(sql_query)`. If that RPC doesn’t exist in your project, create it in the SQL editor (e.g. a `SECURITY DEFINER` function that executes the passed `sql_query` and returns the result). If you don’t create it, only list_tables / get_table_schema / get_table_data / count_table_rows will work.

- **Schema fallback**  
  This repo also has `database-schema-bids.sql` and `Supabase_Structure/` (e.g. `Current_Schema.json`). The AI can use those for schema when MCP isn’t connected or for reference.

## Limitations

- **Read-only**  
  No INSERT/UPDATE/DELETE; only SELECT and read-style tools.
- **list_tables / get_table_schema**  
  Implemented via `information_schema`. If your Supabase/PostgREST setup doesn’t expose those views via the API, those two tools may fail; `get_table_data` and `count_table_rows` still work for normal `public` tables.
- **query_database**  
  Depends on an `exec_sql` RPC existing in your Supabase project.

## Quick reference

- Config: `mcp-config.json`  
- Server script: `scripts/supabase-mcp-server.js`  
- Start: `npm run mcp:supabase` or `npm run dev`
