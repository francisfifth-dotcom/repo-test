create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  available boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;
revoke all on public.menu_items from anon, authenticated;
grant select on public.menu_items to anon, authenticated;

create policy "Available menu is public"
  on public.menu_items for select to anon, authenticated
  using (available = true);

-- Menu writes are reserved for a trusted administrative workflow.
