-- BAYLOS WHOLESALE PORTAL - Supabase foundation
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'reseller' check (role in ('admin','reseller')),
  status text not null default 'pending' check (status in ('pending','approved','suspended','rejected')),
  tier text not null default 'silver' check (tier in ('silver','gold','vip')),
  full_name text, business_name text, email text, whatsapp text, city text, social_media text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.reseller_tiers (
  tier text primary key check (tier in ('silver','gold','vip')),
  name text not null, discount_percent numeric(5,2) not null check (discount_percent between 0 and 100)
);
insert into public.reseller_tiers(tier,name,discount_percent) values
 ('silver','Silver',20),('gold','Gold',30),('vip','VIP',40)
on conflict (tier) do update set name=excluded.name, discount_percent=excluded.discount_percent;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), sku text unique not null, name text not null,
  category text, msrp numeric(14,2) not null default 0, stock integer not null default 0,
  video_url text, caption text, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  color text not null, size text not null check (size in ('S','M','L','XL')), stock integer not null default 0,
  unique(product_id,color,size)
);

create table if not exists public.product_assets (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  type text not null default 'image' check (type in ('image','video','file')), storage_path text, external_url text,
  sort_order integer not null default 0, is_cover boolean not null default false, caption text,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), reseller_id uuid not null references public.profiles(id),
  status text not null default 'new' check (status in ('new','processing','completed','cancelled')),
  subtotal numeric(14,2) not null default 0, discount_total numeric(14,2) not null default 0, total numeric(14,2) not null default 0,
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), variant_id uuid references public.product_variants(id),
  sku_snapshot text not null, product_name_snapshot text not null, color text, size text, qty integer not null check(qty > 0),
  unit_msrp numeric(14,2) not null, discount_percent numeric(5,2) not null, unit_price numeric(14,2) not null, line_total numeric(14,2) not null
);

create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_variants_product on public.product_variants(product_id);
create index if not exists idx_assets_product on public.product_assets(product_id,sort_order);
create index if not exists idx_orders_reseller on public.orders(reseller_id,created_at desc);

-- Profile auto-creation. Role/status are server-defined; user metadata cannot promote an account.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,role,status,tier,full_name,business_name,email,whatsapp,city,social_media)
  values (new.id,'reseller','pending','silver',new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'business_name',new.email,new.raw_user_meta_data->>'whatsapp',new.raw_user_meta_data->>'city',new.raw_user_meta_data->>'social_media');
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role='admin' and status='approved');
$$;

alter table public.profiles enable row level security;
alter table public.reseller_tiers enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_assets enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles for select using (id=auth.uid() or public.is_admin());
drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update using (id=auth.uid() or public.is_admin()) with check ((id=auth.uid() and role='reseller') or public.is_admin());
drop policy if exists tiers_read on public.reseller_tiers;
create policy tiers_read on public.reseller_tiers for select to authenticated using (true);
drop policy if exists tiers_admin on public.reseller_tiers;
create policy tiers_admin on public.reseller_tiers for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists products_read on public.products;
create policy products_read on public.products for select to authenticated using (is_active or public.is_admin());
drop policy if exists products_admin on public.products;
create policy products_admin on public.products for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists variants_read on public.product_variants;
create policy variants_read on public.product_variants for select to authenticated using (exists(select 1 from public.products p where p.id=product_id and (p.is_active or public.is_admin())));
drop policy if exists variants_admin on public.product_variants;
create policy variants_admin on public.product_variants for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists assets_read on public.product_assets;
create policy assets_read on public.product_assets for select to authenticated using (exists(select 1 from public.products p where p.id=product_id and (p.is_active or public.is_admin())));
drop policy if exists assets_admin on public.product_assets;
create policy assets_admin on public.product_assets for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders for select using (reseller_id=auth.uid() or public.is_admin());
drop policy if exists orders_admin on public.orders;
create policy orders_admin on public.orders for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists order_items_read on public.order_items;
create policy order_items_read on public.order_items for select using (exists(select 1 from public.orders o where o.id=order_id and (o.reseller_id=auth.uid() or public.is_admin())));

-- Storage bucket: run once in SQL editor if you want public product images.
-- insert into storage.buckets(id,name,public) values ('product-assets','product-assets',true) on conflict (id) do nothing;
