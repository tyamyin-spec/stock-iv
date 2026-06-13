-- Stock IV — staff position on profile + ward/position captured at sign-up.

-- Job position (nurse grade). Distinct from `role` (admin/staff system access).
alter table public.profiles
  add column if not exists position text check (position in ('NA','PN','RN'));

-- The sign-up screen needs to list wards BEFORE the user is authenticated,
-- so allow anonymous read of the (non-sensitive) ward list.
drop policy if exists anon_read_wards on public.wards;
create policy anon_read_wards on public.wards for select to anon using (true);

-- Copy display_name + ward_id + position from sign-up metadata into the profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, ward_id, position)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'ward_id', '')::uuid,
    nullif(new.raw_user_meta_data->>'position', '')
  );
  return new;
end;
$$;
