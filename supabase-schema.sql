-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
create table products (
  id           text primary key,
  name         text not null,
  category     text not null,
  gender       text not null check (gender in ('men','women')),
  price        integer not null,
  images       text[] default '{}',
  created_at   timestamptz default now()
);

-- ─── COLLECTIONS ─────────────────────────────────────────────────────────────
create table collections (
  id           uuid primary key default gen_random_uuid(),
  name         text not null unique,
  active       boolean default true,
  banner_url   text,
  product_count integer default 0,
  created_at   timestamptz default now()
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create table orders (
  id           text primary key,
  customer     text not null,
  email        text not null,
  address      text,
  payment      text,
  status       text default 'Pending' check (status in ('Pending','Processing','Shipped','Delivered','Cancelled')),
  shipping     integer default 0,
  tax          integer default 0,
  subtotal     integer not null,
  total        integer not null,
  created_at   timestamptz default now()
);

-- ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
create table order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     text references orders(id) on delete cascade,
  product_name text not null,
  size         text not null,
  qty          integer not null,
  price        integer not null
);

-- ─── INVENTORY ───────────────────────────────────────────────────────────────
create table inventory (
  id           uuid primary key default gen_random_uuid(),
  sku          text not null unique,
  product_id   text references products(id),
  variant      text not null,
  stock        integer default 0,
  reorder_at   integer default 5,
  updated_at   timestamptz default now()
);

-- ─── SEED PRODUCTS ───────────────────────────────────────────────────────────
insert into products (id, name, category, gender, price) values
  ('p1',  'Wool Overcoat',       'Outerwear',   'men',   1280),
  ('p2',  'Cashmere Sweater',    'Knitwear',    'women', 640),
  ('p3',  'Tailored Blazer',     'Tailoring',   'men',   980),
  ('p4',  'Silk Slip Dress',     'Tailoring',   'women', 720),
  ('p5',  'Leather Belt',        'Accessories', 'men',   310),
  ('p6',  'Structured Tote',     'Accessories', 'women', 890),
  ('p7',  'Merino Turtleneck',   'Knitwear',    'men',   420),
  ('p8',  'Wide-Leg Trouser',    'Tailoring',   'women', 560),
  ('p9',  'Quilted Field Jacket','Outerwear',   'women', 1050),
  ('p10', 'Cotton Poplin Shirt', 'Tailoring',   'men',   340);

-- ─── SEED COLLECTIONS ────────────────────────────────────────────────────────
insert into collections (name, active, product_count) values
  ('Autumn Tailoring',  true,  24),
  ('Coastal Linen',     true,  18),
  ('Evening Silk',      false, 12),
  ('Heritage Knitwear', true,  31),
  ('Studio Denim',      false, 9),
  ('Winter Outerwear',  true,  16);

-- ─── SEED INVENTORY ──────────────────────────────────────────────────────────
insert into inventory (sku, product_id, variant, stock, reorder_at) values
  ('TIV-p1-XS',  'p1',  'XS', 12, 5), ('TIV-p1-S',  'p1',  'S',  18, 5), ('TIV-p1-M',  'p1',  'M',  25, 5), ('TIV-p1-L',  'p1',  'L',  20, 5), ('TIV-p1-XL',  'p1',  'XL', 10, 5),
  ('TIV-p2-XS',  'p2',  'XS', 8,  5), ('TIV-p2-S',  'p2',  'S',  14, 5), ('TIV-p2-M',  'p2',  'M',  20, 5), ('TIV-p2-L',  'p2',  'L',  16, 5), ('TIV-p2-XL',  'p2',  'XL', 6,  5),
  ('TIV-p3-XS',  'p3',  'XS', 5,  5), ('TIV-p3-S',  'p3',  'S',  10, 5), ('TIV-p3-M',  'p3',  'M',  15, 5), ('TIV-p3-L',  'p3',  'L',  12, 5), ('TIV-p3-XL',  'p3',  'XL', 8,  5),
  ('TIV-p4-XS',  'p4',  'XS', 10, 5), ('TIV-p4-S',  'p4',  'S',  16, 5), ('TIV-p4-M',  'p4',  'M',  22, 5), ('TIV-p4-L',  'p4',  'L',  18, 5), ('TIV-p4-XL',  'p4',  'XL', 7,  5),
  ('TIV-p5-XS',  'p5',  'XS', 20, 8), ('TIV-p5-S',  'p5',  'S',  30, 8), ('TIV-p5-M',  'p5',  'M',  35, 8), ('TIV-p5-L',  'p5',  'L',  28, 8), ('TIV-p5-XL',  'p5',  'XL', 15, 8),
  ('TIV-p6-XS',  'p6',  'XS', 6,  5), ('TIV-p6-S',  'p6',  'S',  12, 5), ('TIV-p6-M',  'p6',  'M',  18, 5), ('TIV-p6-L',  'p6',  'L',  14, 5), ('TIV-p6-XL',  'p6',  'XL', 5,  5),
  ('TIV-p7-XS',  'p7',  'XS', 9,  5), ('TIV-p7-S',  'p7',  'S',  15, 5), ('TIV-p7-M',  'p7',  'M',  20, 5), ('TIV-p7-L',  'p7',  'L',  17, 5), ('TIV-p7-XL',  'p7',  'XL', 8,  5),
  ('TIV-p8-XS',  'p8',  'XS', 7,  5), ('TIV-p8-S',  'p8',  'S',  13, 5), ('TIV-p8-M',  'p8',  'M',  19, 5), ('TIV-p8-L',  'p8',  'L',  15, 5), ('TIV-p8-XL',  'p8',  'XL', 6,  5),
  ('TIV-p9-XS',  'p9',  'XS', 11, 5), ('TIV-p9-S',  'p9',  'S',  17, 5), ('TIV-p9-M',  'p9',  'M',  23, 5), ('TIV-p9-L',  'p9',  'L',  19, 5), ('TIV-p9-XL',  'p9',  'XL', 9,  5),
  ('TIV-p10-XS', 'p10', 'XS', 14, 5), ('TIV-p10-S', 'p10', 'S',  22, 5), ('TIV-p10-M', 'p10', 'M',  28, 5), ('TIV-p10-L', 'p10', 'L',  24, 5), ('TIV-p10-XL', 'p10', 'XL', 11, 5);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table orders     enable row level security;
alter table order_items enable row level security;
alter table products   enable row level security;
alter table collections enable row level security;
alter table inventory  enable row level security;

-- Public can read products and collections
create policy "public read products"    on products    for select using (true);
create policy "public read collections" on collections for select using (true);

-- Anyone can insert orders (checkout)
create policy "public insert orders"      on orders      for insert with check (true);
create policy "public insert order_items" on order_items for insert with check (true);

-- Service role (admin API) can do everything — handled via supabaseAdmin()
