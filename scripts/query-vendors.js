/**
 * One-off: fetch 10 rows from vendors. Uses .env.local.
 * With anon key, RLS may return 0 rows; use SUPABASE_SERVICE_ROLE_KEY to see all.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { data, error } = await supabase.from("vendors").select("*").limit(10).order("created_at", { ascending: false });
  if (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
  console.log(JSON.stringify(data, null, 2));
  console.log("\nTotal rows returned:", data.length);
}

main();
