import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service role key.
// Only use in API routes and server components — never expose to the browser.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
