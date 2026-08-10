import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client mit vollem Zugriff unter Umgehung von Row Level Security.
// NUR serverseitig verwenden (Route Handler)! Niemals in einer
// "use client"-Datei importieren - der Service-Role-Key darf nie an den
// Browser gehen, sonst kann jeder damit auf alle Daten zugreifen.
export const isSupabaseAdminConfigured = Boolean(supabaseUrl && serviceRoleKey);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;
