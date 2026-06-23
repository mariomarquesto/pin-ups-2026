import { createClient } from '@supabase/supabase-js';

// ⚠️ Usar la ANON KEY para el frontend (NO la service_role key)
const supabaseUrl = 'https://ghvbgymmmokzhhoxhmsr.supabase.co';
const supabaseAnonKey = 'sb_publishable_dE1oRjXmwHQ_Uh2P3SYJSg_X7cfGzZu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);