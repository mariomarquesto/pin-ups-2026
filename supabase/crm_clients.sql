-- ============================================================================
-- CRM de clientas — tabla `crm_clients`
-- Guardá etiquetas y notas de cada clienta en Supabase (no en localStorage).
--
-- CÓMO APLICARLO (una sola vez):
--   1. Entrá a https://supabase.com/dashboard y abrí el proyecto
--      jgjgorhvekmjuksngbtt
--   2. SQL Editor → New query → pegá todo este archivo → Run
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.crm_clients (
  id          uuid primary key default gen_random_uuid(),
  client_key  text unique not null,          -- email normalizado o id de perfil
  nombre      text,
  email       text,
  telefono    text,
  tags        text[]  not null default '{}',  -- etiquetas
  notas       jsonb[] not null default '{}',  -- [{ id, texto, fecha }]
  updated_at  timestamptz not null default now()
);

alter table public.crm_clients enable row level security;

-- Políticas de acceso. Dejan leer/escribir con la clave pública (anon).
-- Si querés restringirlo solo a admins autenticados, reemplazá `using (true)`
-- por una condición sobre auth.uid() / el rol del perfil.
drop policy if exists "crm_clients_select" on public.crm_clients;
create policy "crm_clients_select" on public.crm_clients
  for select using (true);

drop policy if exists "crm_clients_insert" on public.crm_clients;
create policy "crm_clients_insert" on public.crm_clients
  for insert with check (true);

drop policy if exists "crm_clients_update" on public.crm_clients;
create policy "crm_clients_update" on public.crm_clients
  for update using (true) with check (true);

drop policy if exists "crm_clients_delete" on public.crm_clients;
create policy "crm_clients_delete" on public.crm_clients
  for delete using (true);
