insert into public.menu_items (id, name, description, price_cents) values
  ('00000000-0000-4000-8000-000000000001', 'Espresso', 'Rich, bold, and freshly pulled.', 300),
  ('00000000-0000-4000-8000-000000000002', 'Latte', 'Espresso with silky steamed milk.', 450),
  ('00000000-0000-4000-8000-000000000003', 'Cold Brew', 'Slow steeped for a smooth finish.', 500)
on conflict (id) do nothing;
