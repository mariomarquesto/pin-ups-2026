-- ============================================================================
-- Promover usuarios a ADMIN en Supabase (enfoque confiable)
--
-- ⚠️ La creación del usuario (email + contraseña) hacela SIEMPRE desde el
--    Dashboard, NO con SQL directo:
--      Authentication → Users → Add user → Create new user
--      (email + contraseña, tildá "Auto Confirm User" → Create).
--    Insertar a mano en auth.users / auth.identities rompe el login en este
--    proyecto con el error "Database error querying schema".
--
-- Este script SOLO promueve a admin usuarios que YA existen en auth.users.
--
-- USO:
--   1. Creá el/los usuario(s) en el Dashboard (paso de arriba).
--   2. Editá la lista de emails de abajo.
--   3. SQL Editor → New query → pegá el bloque PROMOVER → Run.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- (OPCIONAL) LIMPIEZA: borra admins creados por SQL que no podían loguearse.
-- Descomentá y corré UNA vez si antes usaste el método por SQL directo.
-- ----------------------------------------------------------------------------
-- delete from auth.identities
--  where user_id in (select id from auth.users
--                    where lower(email) in ('admin@pin-ups.com','gerente@pin-ups.com'));
-- delete from auth.users
--  where lower(email) in ('admin@pin-ups.com','gerente@pin-ups.com');
-- delete from public.profiles
--  where lower(email) in ('admin@pin-ups.com','gerente@pin-ups.com');


-- ----------------------------------------------------------------------------
-- PROMOVER a admin (los usuarios ya deben existir en el Dashboard)
-- ----------------------------------------------------------------------------
do $$
declare
  v_email text;
begin
  foreach v_email in array array[
    -- ↓↓↓ EDITÁ ACÁ: emails creados en el Dashboard ↓↓↓
    'mario@gmail.com'
    -- ↑↑↑ uno por linea, separados por comas ↑↑↑
  ]
  loop
    insert into public.profiles (id, email, role, nombre)
    select id,
           lower(email),
           'admin',
           coalesce(raw_user_meta_data->>'nombre', split_part(email, '@', 1))
    from auth.users
    where lower(email) = lower(v_email)
    on conflict (id) do update
      set role   = 'admin',
          email  = coalesce(public.profiles.email, excluded.email),
          nombre = coalesce(public.profiles.nombre, excluded.nombre);

    if not found then
      raise warning 'No existe % en auth.users: crealo en el Dashboard primero.', v_email;
    end if;
  end loop;
end $$;


-- ----------------------------------------------------------------------------
-- VERIFICACIÓN: lista los admins actuales
-- ----------------------------------------------------------------------------
-- select u.email, p.role, p.nombre
-- from public.profiles p
-- join auth.users u on u.id = p.id
-- where p.role = 'admin';
