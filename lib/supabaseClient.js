import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ist nur gesetzt, wenn die .env.local korrekt ausgefüllt wurde.
// So kann der Rest der App erkennen, ob die Datenbank-Anbindung
// schon eingerichtet ist, statt mit einem kryptischen Fehler abzustürzen.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
