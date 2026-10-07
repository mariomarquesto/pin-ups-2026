import { createClient } from '@supabase/supabase-js';

// ⚠️ Usar la ANON KEY (publishable) para el frontend, NUNCA la service_role key.
// Definir VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env. Los valores por
// defecto son de respaldo para que el build en Vercel (sin .env) conecte igual.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://jgjgorhvekmjuksngbtt.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_kakX2qZ0ytAuUzhMSHV-mQ_Z_bpOOu1';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);