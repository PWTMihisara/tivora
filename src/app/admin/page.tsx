'use client';

import { useState, useEffect } from 'react';
import { useSharedStore, SharedOrder } from '@/store/useSharedStore';
import { PRODUCTS as STOREFRONT_PRODUCTS } from '@/data/products';

/* ─── Login Screen ───────────────────────────────────────────────────────────── */

const ADMIN_EMAIL    = 'admin@tivora.com';
const ADMIN_PASSWORD = 'admin123';
const AUTH_KEY       = 'tivora_admin_auth';

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && password.trim() === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, '1');
      onLogin();
    } else {
      setError('Invalid email or password.');
    }
  };

  const inputSty: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', border: '1px solid #E7E4DE',
    borderRadius: 8, padding: '11px 14px', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', background: '#fff',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F5F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ width: 380, background: '#fff', borderRadius: 16, border: '1px solid #E7E4DE', padding: '40px 36px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.02em' }}>TIVORA</div>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A6A199', marginTop: 4 }}>Admin Console</div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7C7870', marginBottom: 6 }}>Email</div>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@tivora.com" required autoComplete="off" style={inputSty}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#7C7870', marginBottom: 6 }}>Password</div>
            <input
              type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••" required autoComplete="new-password" style={inputSty}
            />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: '#A6402E', background: '#FBEAE7', border: '1px solid #F5C6BC', borderRadius: 8, padding: '10px 14px' }}>{error}</div>
          )}
          <button type="submit" style={{ width: '100%', background: '#181715', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 6, letterSpacing: '0.04em' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#A6A199' }}>
          Use <strong>admin@tivora.com</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
type Screen = 'dashboard' | 'orders' | 'products' | 'inventory' | 'collections' | 'customers' | 'analytics' | 'settings';

interface OrderItem { name: string; variant: string; qty: number; price: number }
interface Order {
  id: string; customer: string; email: string; date: string;
  items: OrderItem[]; payment: string; address: string;
  status: OrderStatus; shipping: number; tax: number;
  itemCount: number; subtotal: number; total: number;
}
interface InventoryRow { sku: string; product: string; variant: string; stock: number; reorderAt: number }
interface Collection { name: string; count: number; active: boolean }
interface Customer { name: string; email: string; location: string; orders: number; ltv: number; lastOrder: string }
interface TeamMember { name: string; email: string; role: string }

/* ─── Colours & helpers ──────────────────────────────────────────────────────── */

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending:    { bg: '#FBF0DE', text: '#96631B' },
  Processing: { bg: '#EAEEF7', text: '#37518F' },
  Shipped:    { bg: '#EFEDE8', text: '#6B675F' },
  Delivered:  { bg: '#EAF3EC', text: '#2F6B45' },
  Cancelled:  { bg: '#FBEAE7', text: '#A6402E' },
};

const HATCH = 'repeating-linear-gradient(135deg,#F1EFEA,#F1EFEA 6px,#E7E4DE 6px,#E7E4DE 12px)';

function badgeSty(status: string): React.CSSProperties {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.Pending;
  return { display: 'inline-block', background: c.bg, color: c.text, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6 };
}

const money = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d: string) => { const dt = new Date(d); return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };


/* ─── Data ───────────────────────────────────────────────────────────────────── */

const ORDERS: Order[] = [
  { id: '#3021', customer: 'Elena Marceau',  email: 'elena.m@mail.com',    date: 'Jul 28', items: [{ name: 'Wool Overcoat',     variant: 'Charcoal / M', qty: 1, price: 640 }, { name: 'Silk Scarf',   variant: 'Ivory',      qty: 1, price: 180 }], payment: 'Visa •• 4471',        address: '12 Rue de Varenne, Paris, FR',       status: 'Processing', shipping: 18, tax: 52, itemCount: 2, subtotal: 820, total: 890 },
  { id: '#3020', customer: 'Marcus Ide',     email: 'marcus.ide@mail.com', date: 'Jul 28', items: [{ name: 'Cashmere Sweater',  variant: 'Navy / L',     qty: 2, price: 320 }],                                                                     payment: 'Amex •• 1082',        address: '88 Fifth Ave, New York, US',         status: 'Pending',    shipping: 0,  tax: 40, itemCount: 2, subtotal: 640, total: 680 },
  { id: '#3019', customer: 'Sofia Reyes',    email: 'sofia.r@mail.com',    date: 'Jul 27', items: [{ name: 'Leather Loafers',   variant: 'Tan / 40',     qty: 1, price: 410 }],                                                                     payment: 'Mastercard •• 9903', address: '4 Calle Mayor, Madrid, ES',          status: 'Shipped',    shipping: 22, tax: 33, itemCount: 1, subtotal: 410, total: 465 },
  { id: '#3018', customer: 'Thomas Berg',    email: 'thomas.b@mail.com',   date: 'Jul 27', items: [{ name: 'Tailored Trousers', variant: 'Grey / 32',    qty: 1, price: 290 }, { name: 'Linen Shirt', variant: 'White / M',  qty: 2, price: 150 }], payment: 'Visa •• 2210',        address: '19 Königstraße, Berlin, DE',         status: 'Delivered',  shipping: 15, tax: 47, itemCount: 3, subtotal: 590, total: 652 },
  { id: '#3017', customer: 'Ava Whitfield',  email: 'ava.w@mail.com',      date: 'Jul 26', items: [{ name: 'Silk Blouse',       variant: 'Blush / S',    qty: 1, price: 210 }],                                                                     payment: 'Visa •• 7734',        address: '5 King St, London, UK',              status: 'Cancelled',  shipping: 0,  tax: 0,  itemCount: 1, subtotal: 210, total: 210 },
  { id: '#3016', customer: 'Noah Kessler',   email: 'noah.k@mail.com',     date: 'Jul 26', items: [{ name: 'Merino Blazer',     variant: 'Navy / 40',    qty: 1, price: 580 }],                                                                     payment: 'Amex •• 4420',        address: '70 Bahnhofstrasse, Zurich, CH',      status: 'Delivered',  shipping: 0,  tax: 46, itemCount: 1, subtotal: 580, total: 626 },
  { id: '#3015', customer: 'Isla Fontaine',  email: 'isla.f@mail.com',     date: 'Jul 25', items: [{ name: 'Cashmere Sweater',  variant: 'Camel / M',    qty: 1, price: 320 }, { name: 'Wool Scarf',  variant: 'Grey',       qty: 1, price: 120 }], payment: 'Mastercard •• 3391', address: '3 Via Montenapoleone, Milan, IT',    status: 'Shipped',    shipping: 20, tax: 35, itemCount: 2, subtotal: 440, total: 495 },
  { id: '#3014', customer: 'Ethan Cole',     email: 'ethan.c@mail.com',    date: 'Jul 24', items: [{ name: 'Leather Belt',      variant: 'Black / 34',   qty: 1, price: 95  }],                                                                     payment: 'Visa •• 6650',        address: '200 Bay St, Toronto, CA',            status: 'Delivered',  shipping: 12, tax: 8,  itemCount: 1, subtotal: 95,  total: 115 },
];


const INVENTORY: InventoryRow[] = [
  { sku: 'TIV-OC-001', product: 'Wool Overcoat',     variant: 'Charcoal / M', stock: 14, reorderAt: 8  },
  { sku: 'TIV-CS-014', product: 'Cashmere Sweater',  variant: 'Navy / L',     stock: 4,  reorderAt: 10 },
  { sku: 'TIV-SB-022', product: 'Silk Blouse',       variant: 'Blush / S',    stock: 22, reorderAt: 12 },
  { sku: 'TIV-TT-009', product: 'Tailored Trousers', variant: 'Grey / 32',    stock: 0,  reorderAt: 6  },
  { sku: 'TIV-LL-031', product: 'Leather Loafers',   variant: 'Tan / 40',     stock: 9,  reorderAt: 8  },
  { sku: 'TIV-MB-005', product: 'Merino Blazer',     variant: 'Navy / 40',    stock: 2,  reorderAt: 6  },
  { sku: 'TIV-LS-018', product: 'Linen Shirt',       variant: 'White / M',    stock: 31, reorderAt: 15 },
  { sku: 'TIV-LB-044', product: 'Leather Belt',      variant: 'Black / 34',   stock: 18, reorderAt: 10 },
];

const BASE_COLLECTIONS: Collection[] = [
  { name: 'Autumn Tailoring',  count: 24, active: true  },
  { name: 'Coastal Linen',     count: 18, active: true  },
  { name: 'Evening Silk',      count: 12, active: false },
  { name: 'Heritage Knitwear', count: 31, active: true  },
  { name: 'Studio Denim',      count: 9,  active: false },
  { name: 'Winter Outerwear',  count: 16, active: true  },
];

const CUSTOMERS: Customer[] = [
  { name: 'Elena Marceau', email: 'elena.m@mail.com',    location: 'Paris, FR',    orders: 14, ltv: 6820, lastOrder: 'Jul 28' },
  { name: 'Marcus Ide',    email: 'marcus.ide@mail.com', location: 'New York, US', orders: 3,  ltv: 960,  lastOrder: 'Jul 28' },
  { name: 'Sofia Reyes',   email: 'sofia.r@mail.com',    location: 'Madrid, ES',   orders: 8,  ltv: 2410, lastOrder: 'Jul 27' },
  { name: 'Thomas Berg',   email: 'thomas.b@mail.com',   location: 'Berlin, DE',   orders: 21, ltv: 9140, lastOrder: 'Jul 27' },
  { name: 'Ava Whitfield', email: 'ava.w@mail.com',      location: 'London, UK',   orders: 1,  ltv: 210,  lastOrder: 'Jul 26' },
  { name: 'Noah Kessler',  email: 'noah.k@mail.com',     location: 'Zurich, CH',   orders: 6,  ltv: 3480, lastOrder: 'Jul 26' },
  { name: 'Isla Fontaine', email: 'isla.f@mail.com',     location: 'Milan, IT',    orders: 11, ltv: 5220, lastOrder: 'Jul 25' },
  { name: 'Ethan Cole',    email: 'ethan.c@mail.com',    location: 'Toronto, CA',  orders: 2,  ltv: 390,  lastOrder: 'Jul 24' },
];

const TEAM: TeamMember[] = [
  { name: 'Jordan Marsh', email: 'jordan@tivora.com', role: 'Store Admin'  },
  { name: 'Priya Nandan', email: 'priya@tivora.com',  role: 'Merchandiser' },
  { name: 'Owen Blake',   email: 'owen@tivora.com',   role: 'Support'      },
];

const SCREEN_META: Record<Screen, { title: string; subtitle: string }> = {
  dashboard:   { title: 'Dashboard',   subtitle: 'Store performance at a glance'      },
  orders:      { title: 'Orders',      subtitle: 'Manage and fulfill customer orders' },
  products:    { title: 'Products',    subtitle: 'Manage your catalog'                },
  inventory:   { title: 'Inventory',   subtitle: 'Track stock across SKUs'            },
  collections: { title: 'Collections', subtitle: 'Organize products into collections' },
  customers:   { title: 'Customers',   subtitle: 'View customer profiles and value'   },
  analytics:   { title: 'Analytics',   subtitle: 'Deep dive into sales performance'   },
  settings:    { title: 'Settings',    subtitle: 'Store configuration'                },
};

const NAV_GROUPS: { label: string; items: { key: Screen; label: string; badge?: boolean }[] }[] = [
  { label: 'General', items: [{ key: 'dashboard', label: 'Dashboard' }, { key: 'analytics', label: 'Analytics' }] },
  { label: 'Catalog', items: [{ key: 'products', label: 'Products' }, { key: 'collections', label: 'Collections' }, { key: 'inventory', label: 'Inventory' }] },
  { label: 'Sales',   items: [{ key: 'orders', label: 'Orders', badge: true }, { key: 'customers', label: 'Customers' }] },
  { label: 'System',  items: [{ key: 'settings', label: 'Settings' }] },
];

const REV_BARS = [42, 58, 50, 66, 74, 60, 80, 70, 88, 76, 92, 84];
const STATUS_STEPS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const STATUS_FILTERS = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const CATEGORY_SPLITS = [
  { name: 'Outerwear', pct: 32 }, { name: 'Knitwear', pct: 24 },
  { name: 'Footwear',  pct: 18 }, { name: 'Shirts',   pct: 16 },
  { name: 'Accessories', pct: 10 },
];

/* ─── Sidebar ────────────────────────────────────────────────────────────────── */

function Sidebar({ screen, setScreen, pendingCount, onLogout }: {
  screen: Screen; setScreen: (s: Screen) => void; pendingCount: number; onLogout: () => void;
}) {
  return (
    <div style={{ width: 260, flexShrink: 0, background: '#fff', borderRight: '1px solid #E7E4DE', display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #EFEDE8' }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.02em' }}>TIVORA</div>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A6A199', marginTop: 4 }}>Admin Console</div>
      </div>

      <div style={{ padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A6A199', padding: '10px 12px 6px' }}>
              {group.label}
            </div>
            {group.items.map(item => {
              const active = screen === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setScreen(item.key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, width: '100%', border: 'none', background: active ? '#F7F5F2' : 'transparent', color: active ? '#181715' : '#7C7870', textAlign: 'left' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#96733A' : 'transparent', flexShrink: 0, display: 'block' }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: '#96733A', color: '#fff', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 10 }}>
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #EFEDE8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#181715', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>JM</div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Jordan Marsh</div>
            <div style={{ fontSize: 11, color: '#A6A199' }}>Store Admin</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{ width: '100%', background: '#F7F5F2', border: '1px solid #E7E4DE', borderRadius: 8, padding: '8px 0', fontSize: 13, fontWeight: 600, color: '#7C7870', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

/* ─── Top Header ─────────────────────────────────────────────────────────────── */

function TopHeader({ screen, search, setSearch, pendingOrders, lowStockItems, onGoOrders, onGoInventory }: {
  screen: Screen; search: string; setSearch: (v: string) => void;
  pendingOrders: Order[]; lowStockItems: { product: string; stock: number; reorder_at: number }[];
  onGoOrders: () => void; onGoInventory: () => void;
}) {
  const meta = SCREEN_META[screen];
  const searchable: Screen[] = ['inventory', 'orders', 'products', 'customers'];
  const showSearch = searchable.includes(screen);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    ...pendingOrders.map(o => ({ type: 'order' as const, title: `New order ${o.id}`, sub: `${o.customer} · ${money(o.total)}`, action: onGoOrders })),
    ...lowStockItems.map(r => ({ type: 'stock' as const, title: `Low stock: ${r.product}`, sub: `${r.stock} units remaining (reorder at ${r.reorder_at})`, action: onGoInventory })),
  ];
  const hasNotif = notifications.length > 0;

  return (
    <div style={{ height: 76, flexShrink: 0, background: '#fff', borderBottom: '1px solid #E7E4DE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', position: 'sticky', top: 0, zIndex: 5 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700 }}>{meta.title}</div>
        <div style={{ fontSize: 13, color: '#A6A199', marginTop: 2 }}>{meta.subtitle}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {showSearch && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F7F5F2', border: '1px solid #E7E4DE', borderRadius: 8, padding: '8px 14px', width: 240 }}>
            <div style={{ width: 14, height: 14, border: '1.5px solid #A6A199', borderRadius: '50%', flexShrink: 0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`Search ${meta.title}...`}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 13, color: '#181715', width: '100%', fontFamily: 'inherit' }}
            />
          </div>
        )}

        {/* Notification bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, border: '1px solid #E7E4DE', background: notifOpen ? '#F7F5F2' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C7870" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {hasNotif && (
              <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, background: '#96733A', borderRadius: '50%', border: '2px solid #fff' }} />
            )}
          </button>

          {notifOpen && (
            <>
              <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
              <div style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', zIndex: 11, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #EFEDE8', fontSize: 13, fontWeight: 700 }}>
                  Notifications {hasNotif && <span style={{ fontSize: 11, fontWeight: 700, background: '#FBF0DE', color: '#96631B', padding: '2px 7px', borderRadius: 5, marginLeft: 8 }}>{notifications.length}</span>}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px 18px', fontSize: 13, color: '#A6A199', textAlign: 'center' }}>All caught up!</div>
                ) : (
                  <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                    {notifications.map((n, i) => (
                      <button key={i} onClick={() => { n.action(); setNotifOpen(false); }} style={{ width: '100%', textAlign: 'left', padding: '12px 18px', background: 'none', border: 'none', borderBottom: '1px solid #EFEDE8', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, background: n.type === 'order' ? '#EAF3EC' : '#FBF0DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                          {n.type === 'order' ? '📦' : '⚠️'}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#181715' }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: '#A6A199', marginTop: 2 }}>{n.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#181715', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>JM</div>
      </div>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────────── */

function DashboardScreen({ orders, setScreen }: { orders: Order[]; setScreen: (s: Screen) => void }) {
  const now = Date.now();
  const day30 = 30 * 24 * 60 * 60 * 1000;
  const day60 = 60 * 24 * 60 * 60 * 1000;

  const recent   = orders.filter(o => o.status !== 'Cancelled' && now - new Date(o.date).getTime() <= day30);
  const previous = orders.filter(o => { const t = new Date(o.date).getTime(); return o.status !== 'Cancelled' && now - t > day30 && now - t <= day60; });

  const rev30    = recent.reduce((s, o) => s + o.total, 0);
  const revPrev  = previous.reduce((s, o) => s + o.total, 0);
  const revDelta = revPrev > 0 ? ((rev30 - revPrev) / revPrev * 100).toFixed(1) : null;

  const avgOrder   = recent.length ? Math.round(rev30 / recent.length) : 0;
  const avgPrev    = previous.length ? Math.round(revPrev / previous.length) : 0;
  const avgDelta   = avgPrev > 0 ? ((avgOrder - avgPrev) / avgPrev * 100).toFixed(1) : null;

  const orderDelta = previous.length > 0 ? ((recent.length - previous.length) / previous.length * 100).toFixed(1) : null;

  // Top products from real orders (exclude cancelled)
  const productSales: Record<string, { sold: number; revenue: number }> = {};
  orders.filter(o => o.status !== 'Cancelled').forEach(o => o.items.forEach(item => {
    if (!productSales[item.name]) productSales[item.name] = { sold: 0, revenue: 0 };
    productSales[item.name].sold    += item.qty;
    productSales[item.name].revenue += item.price * item.qty;
  }));
  const topProducts = Object.entries(productSales)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4);

  // Revenue bars — last 12 weeks
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyRev = Array.from({ length: 12 }, (_, i) => {
    const ws = now - (11 - i) * weekMs;
    return orders.filter(o => { const t = new Date(o.date).getTime(); return o.status !== 'Cancelled' && t >= ws && t < ws + weekMs; }).reduce((s, o) => s + o.total, 0);
  });
  const maxBar = Math.max(...weeklyRev, 1);

  const fmt = (delta: string | null, up: boolean) => delta ? `${up ? '+' : ''}${delta}% vs prior 30d` : 'No prior data';

  const KPIS = [
    { label: 'Revenue (30d)',    value: money(rev30),    delta: fmt(revDelta, Number(revDelta) >= 0),   up: Number(revDelta) >= 0  },
    { label: 'Orders',           value: recent.length,   delta: fmt(orderDelta, Number(orderDelta) >= 0), up: Number(orderDelta) >= 0 },
    { label: 'Avg. Order Value', value: money(avgOrder), delta: fmt(avgDelta, Number(avgDelta) >= 0),   up: Number(avgDelta) >= 0  },
    { label: 'Total Orders',     value: orders.filter(o => o.status !== 'Cancelled').length,   delta: `All time`,  up: true  },
  ];
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
        {KPIS.map(kpi => (
          <div key={kpi.label} style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: '22px 24px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{kpi.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 10, whiteSpace: 'nowrap' }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: kpi.up ? '#2F6B45' : '#A6402E', marginTop: 6, fontWeight: 600 }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginTop: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Recent Orders</div>
            <button onClick={() => setScreen('orders')} style={{ fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: '#181715' }}>View all →</button>
          </div>
          {orders.slice(0, 5).map(o => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EFEDE8' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{o.id}</div>
                <div style={{ fontSize: 12, color: '#A6A199', marginTop: 2 }}>{o.customer}</div>
              </div>
              <div style={{ fontSize: 13, color: '#7C7870' }}>{fmtDate(o.date)}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{money(o.total)}</div>
              <span style={badgeSty(o.status)}>{o.status}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Products</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {topProducts.length === 0
              ? <div style={{ fontSize: 13, color: '#A6A199' }}>No orders yet</div>
              : topProducts.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#A6A199' }}>{p.sold} sold</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{money(p.revenue)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24, marginTop: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Revenue Trend — Last 12 Weeks</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160 }}>
          {weeklyRev.map((v, i) => (
            <div
              key={i}
              style={{ flex: 1, height: Math.max((v / maxBar) * 140, v > 0 ? 4 : 2), background: v > 0 ? '#181715' : '#EFEDE8', borderRadius: '4px 4px 0 0', transition: 'background 0.15s', cursor: 'default' }}
              title={`Week ${i + 1}: ${money(v)}`}
              onMouseEnter={e => { if (v > 0) (e.currentTarget as HTMLDivElement).style.background = '#96733A'; }}
              onMouseLeave={e => { if (v > 0) (e.currentTarget as HTMLDivElement).style.background = '#181715'; }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Orders ─────────────────────────────────────────────────────────────────── */

function OrdersScreen({ orders, orderFilter, setOrderFilter, setSelectedOrderId, getStatus }: {
  orders: Order[]; orderFilter: string; setOrderFilter: (f: string) => void;
  setSelectedOrderId: (id: string) => void; getStatus: (id: string, s: OrderStatus) => OrderStatus;
}) {
  const filtered = orders.filter(o => orderFilter === 'All' || getStatus(o.id, o.status) === orderFilter);

  const handleExport = () => {
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Items', 'Subtotal', 'Shipping', 'Tax', 'Total', 'Payment', 'Address', 'Status'];
    const rows = filtered.map(o => [
      o.id, o.customer, o.email, fmtDate(o.date), o.itemCount,
      o.subtotal, o.shipping, o.tax, o.total,
      o.payment, o.address, getStatus(o.id, o.status),
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tivora-orders-${orderFilter.toLowerCase()}-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(f => {
            const active = orderFilter === f;
            return (
              <button key={f} onClick={() => setOrderFilter(f)} style={{ padding: '9px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: active ? '#181715' : '#fff', color: active ? '#fff' : '#7C7870', border: `1px solid ${active ? '#181715' : '#E7E4DE'}` }}>
                {f}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleExport} style={{ border: '1px solid #181715', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, background: '#181715', color: '#fff', cursor: 'pointer' }}>
            Export CSV ({filtered.length})
          </button>
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 70px 50px 90px minmax(110px,1fr) 100px 24px', minWidth: 920, padding: '14px 20px', fontSize: 11, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #EFEDE8' }}>
          {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', ''].map((h, i) => <div key={i}>{h}</div>)}
        </div>
        {filtered.map(o => {
          const status = getStatus(o.id, o.status);
          return (
            <div
              key={o.id}
              onClick={() => setSelectedOrderId(o.id)}
              style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 70px 50px 90px minmax(110px,1fr) 100px 24px', minWidth: 920, padding: '16px 20px', alignItems: 'center', borderBottom: '1px solid #EFEDE8', cursor: 'pointer', fontSize: 13 }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#FAF9F7'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
            >
              <div style={{ fontWeight: 700 }}>{o.id}</div>
              <div>
                <div style={{ fontWeight: 600 }}>{o.customer}</div>
                <div style={{ fontSize: 12, color: '#A6A199' }}>{o.email}</div>
              </div>
              <div style={{ color: '#7C7870' }}>{fmtDate(o.date)}</div>
              <div style={{ color: '#7C7870' }}>{o.itemCount}</div>
              <div style={{ fontWeight: 700 }}>{money(o.total)}</div>
              <div style={{ color: '#7C7870' }}>{o.payment}</div>
              <div><span style={badgeSty(status)}>{status}</span></div>
              <div style={{ color: '#A6A199' }}>→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Products ───────────────────────────────────────────────────────────────── */

function ProductsScreen({ productView, setProductView, productImages, setProductImages }: {
  productView: 'grid' | 'list';
  setProductView: (v: 'grid' | 'list') => void;
  productImages: Record<string, string[]>;
  setProductImages: (id: string, images: string[]) => void;
}) {
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [draftImages, setDraftImages] = useState<(string | null)[]>([null, null, null]);
  const [uploading, setUploading]     = useState<boolean[]>([false, false, false]);
  const [saving, setSaving]           = useState(false);

  const editingProduct = STOREFRONT_PRODUCTS.find(p => p.id === editingId);

  const openEdit = (id: string) => {
    const cur = productImages[id] ?? [];
    setDraftImages([cur[0] ?? null, cur[1] ?? null, cur[2] ?? null]);
    setUploading([false, false, false]);
    setEditingId(id);
  };

  const handleFile = async (slot: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingId) return;

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setDraftImages(prev => { const next = [...prev]; next[slot] = localUrl; return next; });
    setUploading(prev => { const next = [...prev]; next[slot] = true; return next; });

    const ext  = file.name.split('.').pop();
    // eslint-disable-next-line react-hooks/purity
    const path = `products/${editingId}/slot${slot}-${Date.now()}.${ext}`;
    const form = new FormData();
    form.append('file', file);

    const res  = await fetch(`/api/upload?bucket=product-images&path=${path}`, { method: 'POST', body: form });
    const json = await res.json();

    setUploading(prev => { const next = [...prev]; next[slot] = false; return next; });

    if (json.url) {
      setDraftImages(prev => { const next = [...prev]; next[slot] = json.url; return next; });
    } else {
      setDraftImages(prev => { const next = [...prev]; next[slot] = null; return next; });
    }
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    const images = draftImages.filter(Boolean) as string[];

    // Save URLs to Supabase products table via admin API
    await fetch(`/api/products/${editingId}/images`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images }),
    });

    // Update in-memory store so UI updates immediately
    setProductImages(editingId, images);
    setSaving(false);
    setEditingId(null);
  };

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 4, background: '#EFEDE8', borderRadius: 8, padding: 4, marginBottom: 20, width: 'fit-content' }}>
          {(['grid', 'list'] as const).map(v => (
            <button key={v} onClick={() => setProductView(v)} style={{ padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: productView === v ? '#fff' : 'transparent', color: productView === v ? '#181715' : '#7C7870', boxShadow: productView === v ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
              {v === 'grid' ? 'Grid' : 'List'}
            </button>
          ))}
        </div>

        {productView === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: editingId ? 'repeat(3,1fr)' : 'repeat(4,1fr)', gap: 20 }}>
            {STOREFRONT_PRODUCTS.map(p => {
              const imgs = productImages[p.id];
              const hasImg = imgs && imgs.length > 0;
              return (
                <div key={p.id} style={{ background: '#fff', border: `1px solid ${editingId === p.id ? '#181715' : '#E7E4DE'}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ height: 160, position: 'relative', background: HATCH, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {hasImg
                      ? <img src={imgs[0]} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#A6A199', letterSpacing: '0.04em' }}>NO IMAGE</span>
                    }
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 11, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{p.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{money(p.price)}</div>
                      <div style={{ fontSize: 11, color: '#A6A199' }}>{hasImg ? `${imgs.length}/3` : '0/3'} images</div>
                    </div>
                    <button onClick={() => editingId === p.id ? setEditingId(null) : openEdit(p.id)} style={{ width: '100%', marginTop: 12, border: '1px solid #E7E4DE', borderRadius: 7, padding: '8px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: editingId === p.id ? '#181715' : 'transparent', color: editingId === p.id ? '#fff' : '#181715' }}>
                      {editingId === p.id ? 'Editing…' : 'Edit Images'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '56px 1.6fr 1fr 100px 80px 100px', minWidth: 760, padding: '14px 20px', fontSize: 11, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #EFEDE8' }}>
              {['', 'Product', 'Category', 'Price', 'Images', ''].map((h, i) => <div key={i}>{h}</div>)}
            </div>
            {STOREFRONT_PRODUCTS.map(p => {
              const imgs = productImages[p.id];
              const hasImg = imgs && imgs.length > 0;
              return (
                <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '56px 1.6fr 1fr 100px 80px 100px', minWidth: 760, padding: '12px 20px', alignItems: 'center', borderBottom: '1px solid #EFEDE8', fontSize: 13, background: editingId === p.id ? '#FAFAF8' : 'transparent' }}>
                  <div style={{ width: 38, height: 44, borderRadius: 6, background: HATCH, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                    {hasImg && <img src={imgs[0]} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: '#7C7870' }}>{p.category}</div>
                  <div style={{ fontWeight: 700 }}>{money(p.price)}</div>
                  <div style={{ color: '#A6A199' }}>{hasImg ? `${imgs.length}/3` : '0/3'}</div>
                  <button onClick={() => editingId === p.id ? setEditingId(null) : openEdit(p.id)} style={{ border: '1px solid #E7E4DE', borderRadius: 7, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: editingId === p.id ? '#181715' : 'transparent', color: editingId === p.id ? '#fff' : '#181715' }}>
                    {editingId === p.id ? 'Editing…' : 'Edit'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image Edit Panel */}
      {editingProduct && (
        <div style={{ width: 300, flexShrink: 0, background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Edit Images</div>
            <button onClick={() => setEditingId(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#A6A199', fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ fontSize: 12, color: '#A6A199', marginBottom: 20 }}>{editingProduct.name}</div>

          {[0, 1, 2].map(slot => (
            <div key={slot} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#7C7870', marginBottom: 6 }}>
                Image {slot + 1}{slot === 0 ? ' (Main)' : ''}
              </div>
              <div style={{ position: 'relative', height: 110, background: HATCH, borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E7E4DE' }}>
                {draftImages[slot] && (
                  <img src={draftImages[slot]!} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
                {!draftImages[slot] && (
                  <span style={{ fontSize: 10, color: '#A6A199', pointerEvents: 'none' }}>No image</span>
                )}
                <label style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8, zIndex: 2 }}>
                  <span style={{ background: 'rgba(24,23,21,0.72)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 6 }}>
                    {draftImages[slot] ? 'Replace' : 'Upload'}
                  </span>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(slot, e)} />
                </label>
                {draftImages[slot] && (
                  <button
                    onClick={() => setDraftImages(prev => { const n = [...prev]; n[slot] = null; return n; })}
                    style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(24,23,21,0.72)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
                  >×</button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving || uploading.some(Boolean)}
            style={{ width: '100%', background: '#181715', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 0', fontSize: 13, fontWeight: 700, cursor: saving || uploading.some(Boolean) ? 'not-allowed' : 'pointer', opacity: saving || uploading.some(Boolean) ? 0.6 : 1, marginTop: 4 }}
          >
            {saving ? 'Saving…' : uploading.some(Boolean) ? 'Uploading…' : 'Save Images'}
          </button>
          <button onClick={() => setEditingId(null)} style={{ width: '100%', background: 'transparent', color: '#7C7870', border: '1px solid #E7E4DE', borderRadius: 8, padding: '9px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Inventory ──────────────────────────────────────────────────────────────── */

function InventoryScreen({ search }: { search: string }) {
  const [rows, setRows] = useState<{ id: string; sku: string; product: string; variant: string; stock: number; reorder_at: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inventory')
      .then(r => r.json())
      .then((data: { id: string; sku: string; products: { name: string }; variant: string; stock: number; reorder_at: number }[]) => {
        if (Array.isArray(data)) {
          setRows(data.map(r => ({ id: r.id, sku: r.sku, product: r.products?.name ?? '', variant: r.variant, stock: r.stock, reorder_at: r.reorder_at })));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const q = search.toLowerCase();
  const filtered = q
    ? rows.filter(r => r.sku.toLowerCase().includes(q) || r.product.toLowerCase().includes(q) || r.variant.toLowerCase().includes(q))
    : rows;

  return (
    <div>
      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1.6fr 1fr 90px 100px 110px', minWidth: 880, padding: '14px 20px', fontSize: 11, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #EFEDE8' }}>
          {['SKU', 'Product', 'Variant', 'Stock', 'Reorder At', 'Status'].map(h => <div key={h}>{h}</div>)}
        </div>
        {loading ? (
          <div style={{ padding: '24px 20px', fontSize: 13, color: '#A6A199' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '24px 20px', fontSize: 13, color: '#A6A199' }}>{q ? `No results for "${search}"` : 'No inventory data.'}</div>
        ) : filtered.map(row => {
          const status = row.stock === 0 ? 'Out of stock' : row.stock <= row.reorder_at ? 'Low' : 'Healthy';
          return (
            <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '140px 1.6fr 1fr 90px 100px 110px', minWidth: 880, padding: '14px 20px', alignItems: 'center', borderBottom: '1px solid #EFEDE8', fontSize: 13 }}>
              <div style={{ color: '#7C7870', fontFamily: 'monospace', fontSize: 12 }}>{row.sku}</div>
              <div style={{ fontWeight: 600 }}>{row.product}</div>
              <div style={{ color: '#7C7870' }}>{row.variant}</div>
              <div style={{ fontWeight: 700 }}>{row.stock}</div>
              <div style={{ color: '#A6A199' }}>{row.reorder_at}</div>
              <span style={badgeSty(row.stock === 0 ? 'Cancelled' : row.stock <= row.reorder_at ? 'Pending' : 'Delivered')}>{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Collections ────────────────────────────────────────────────────────────── */

function CollectionsScreen({ collections, collectionBanners, setCollectionBanner, toggleCollection }: {
  collections: Collection[];
  collectionBanners: Record<string, string>;
  setCollectionBanner: (name: string, image: string) => void;
  toggleCollection: (name: string) => void;
}) {
  const handleFile = async (name: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setCollectionBanner(name, localUrl);

    // Upload to Supabase Storage
    const ext  = file.name.split('.').pop();
    // eslint-disable-next-line react-hooks/purity
    const path = `collections/${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${ext}`;
    const form = new FormData();
    form.append('file', file);

    const res  = await fetch(`/api/upload?bucket=product-images&path=${path}`, { method: 'POST', body: form });
    const json = await res.json();

    if (json.url) {
      // Save URL to Supabase collections table
      await fetch('/api/collections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, banner_url: json.url }),
      });
      setCollectionBanner(name, json.url);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
      {collections.map(c => {
        const banner = collectionBanners[c.name];
        return (
          <div key={c.name} style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, overflow: 'hidden' }}>
            {/* Banner area with upload overlay */}
            <div style={{ height: 160, position: 'relative', background: HATCH, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {banner
                ? <img src={banner} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#A6A199', letterSpacing: '0.04em' }}>NO BANNER</span>
              }
              <label style={{ position: 'absolute', inset: 0, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 10, zIndex: 2 }}>
                <span style={{ background: 'rgba(24,23,21,0.72)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 6 }}>
                  {banner ? 'Replace Banner' : 'Upload Banner'}
                </span>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(c.name, e)} />
              </label>
              {banner && (
                <button
                  onClick={() => setCollectionBanner(c.name, '')}
                  style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: 'rgba(24,23,21,0.72)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 15, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}
                >×</button>
              )}
            </div>

            <div style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{c.name}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: c.active ? '#EAF3EC' : '#EFEDE8', color: c.active ? '#2F6B45' : '#7C7870' }}>
                  {c.active ? 'Active' : 'Draft'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#A6A199', marginTop: 6 }}>{c.count} products</div>
              <button
                onClick={() => toggleCollection(c.name)}
                style={{
                  width: '100%', marginTop: 14, padding: '8px 0', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${c.active ? '#F5C6BC' : '#181715'}`,
                  background: c.active ? '#FBEAE7' : '#181715',
                  color: c.active ? '#A6402E' : '#fff',
                }}
              >
                {c.active ? 'Deactivate' : 'Set Active'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Customers ──────────────────────────────────────────────────────────────── */

function CustomersScreen({ orders }: { orders: Order[] }) {
  // Build customer list from real orders grouped by email
  const customerMap: Record<string, { name: string; email: string; orders: number; ltv: number; lastOrder: string }> = {};
  orders.forEach(o => {
    if (!o.email) return;
    if (!customerMap[o.email]) {
      customerMap[o.email] = { name: o.customer, email: o.email, orders: 0, ltv: 0, lastOrder: o.date };
    }
    customerMap[o.email].orders += 1;
    if (o.status !== 'Cancelled') customerMap[o.email].ltv += o.total;
    // Keep most recent order date
    if (new Date(o.date) > new Date(customerMap[o.email].lastOrder)) {
      customerMap[o.email].lastOrder = o.date;
    }
  });

  const customers = Object.values(customerMap).sort((a, b) => b.ltv - a.ltv);

  return (
    <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, overflowX: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 80px 140px 130px 90px', minWidth: 800, padding: '14px 20px', fontSize: 11, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #EFEDE8' }}>
        {['Customer', 'Orders', 'Lifetime Value', 'Last Order', 'Tier'].map(h => <div key={h}>{h}</div>)}
      </div>
      {customers.length === 0 ? (
        <div style={{ padding: '24px 20px', fontSize: 13, color: '#A6A199' }}>No customers yet.</div>
      ) : customers.map(c => {
        const tier = c.ltv > 5000 ? 'VIP' : c.ltv > 1500 ? 'Regular' : 'New';
        const tierSty: React.CSSProperties = { display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: tier === 'VIP' ? '#FBF0DE' : tier === 'Regular' ? '#EAEEF7' : '#EFEDE8', color: tier === 'VIP' ? '#96631B' : tier === 'Regular' ? '#37518F' : '#7C7870' };
        return (
          <div key={c.email} style={{ display: 'grid', gridTemplateColumns: '1.8fr 80px 140px 130px 90px', minWidth: 800, padding: '14px 20px', alignItems: 'center', borderBottom: '1px solid #EFEDE8', fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 12, color: '#A6A199' }}>{c.email}</div>
            </div>
            <div style={{ color: '#7C7870' }}>{c.orders}</div>
            <div style={{ fontWeight: 700 }}>{money(c.ltv)}</div>
            <div style={{ color: '#7C7870' }}>{c.lastOrder}</div>
            <span style={tierSty}>{tier}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────────────────────────────── */

function AnalyticsScreen({ orders }: { orders: Order[] }) {
  // Revenue by week (last 8 weeks)
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const weeklyRevenue = Array.from({ length: 8 }, (_, i) => {
    const weekStart = now - (7 - i) * weekMs;
    const weekEnd   = weekStart + weekMs;
    return orders
      .filter(o => { const t = new Date(o.date).getTime(); return o.status !== 'Cancelled' && t >= weekStart && t < weekEnd; })
      .reduce((s, o) => s + o.total, 0);
  });
  const maxRev = Math.max(...weeklyRevenue, 1);

  const activeOrders = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders  = activeOrders.length;

  // Sales by category from order items
  const catRevMap: Record<string, number> = {};
  activeOrders.forEach(o => o.items.forEach(item => {
    const p = STOREFRONT_PRODUCTS.find(sp => sp.name === item.name);
    const cat = p?.category ?? 'Other';
    catRevMap[cat] = (catRevMap[cat] ?? 0) + item.price * item.qty;
  }));
  const totalCatRev = Object.values(catRevMap).reduce((a, b) => a + b, 0) || 1;
  const categorySplits = Object.entries(catRevMap)
    .map(([name, rev]) => ({ name, pct: Math.round((rev / totalCatRev) * 100) }))
    .sort((a, b) => b.pct - a.pct);

  // Top products by revenue
  const productRevMap: Record<string, { sold: number; revenue: number }> = {};
  activeOrders.forEach(o => o.items.forEach(item => {
    if (!productRevMap[item.name]) productRevMap[item.name] = { sold: 0, revenue: 0 };
    productRevMap[item.name].sold    += item.qty;
    productRevMap[item.name].revenue += item.price * item.qty;
  }));
  const topProducts = Object.entries(productRevMap)
    .map(([name, d]) => ({ name, ...d }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const W = 560, H = 160, PAD = 24;
  const points = weeklyRevenue.map((v, i) => {
    const x = PAD + (i / 7) * (W - PAD * 2);
    const y = H - PAD - (v / maxRev) * (H - PAD * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[
          { label: 'Total Revenue',  value: money(totalRevenue) },
          { label: 'Total Orders',   value: totalOrders },
          { label: 'Avg Order Value', value: totalOrders ? money(Math.round(totalRevenue / totalOrders)) : 'Rs. 0.00' },
        ].map(k => (
          <div key={k.label} style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 12, color: '#A6A199', fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Revenue chart */}
        <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Revenue — Last 8 Weeks</div>
          {totalOrders === 0 ? (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A6A199', fontSize: 13 }}>No order data yet</div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#181715" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#181715" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`${PAD},${H - PAD} ${points} ${W - PAD},${H - PAD}`} fill="url(#revGrad)" />
              <polyline points={points} fill="none" stroke="#181715" strokeWidth={2.5} strokeLinejoin="round" />
              {weeklyRevenue.map((v, i) => {
                const x = PAD + (i / 7) * (W - PAD * 2);
                const y = H - PAD - (v / maxRev) * (H - PAD * 2);
                return <circle key={i} cx={x} cy={y} r={4} fill="#fff" stroke="#181715" strokeWidth={2} />;
              })}
            </svg>
          )}
        </div>

        {/* Sales by category */}
        <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Sales by Category</div>
          {categorySplits.length === 0 ? (
            <div style={{ color: '#A6A199', fontSize: 13 }}>No data yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {categorySplits.map(s => (
                <div key={s.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ color: '#7C7870' }}>{s.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: '#F1EFEA', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${s.pct}%`, background: '#181715', borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Top Products by Revenue</div>
        {topProducts.length === 0 ? (
          <div style={{ color: '#A6A199', fontSize: 13 }}>No data yet</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', padding: '10px 0', fontSize: 11, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #EFEDE8' }}>
              {['Product', 'Units Sold', 'Revenue'].map(h => <div key={h}>{h}</div>)}
            </div>
            {topProducts.map(p => (
              <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', padding: '12px 0', fontSize: 13, borderBottom: '1px solid #EFEDE8', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div style={{ color: '#7C7870' }}>{p.sold}</div>
                <div style={{ fontWeight: 700 }}>{money(p.revenue)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Settings ───────────────────────────────────────────────────────────────── */

function SettingsScreen({ notifPrefs, toggleNotif }: {
  notifPrefs: Record<string, boolean>; toggleNotif: (key: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 720 }}>
      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Store Profile</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { label: 'Store name',       value: 'Tivora Clothing'    },
            { label: 'Support email',    value: 'support@tivora.com' },
            { label: 'Default currency', value: 'LKR (Rs.)'          },
            { label: 'Timezone',         value: 'UTC+0 — London'     },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#7C7870', marginBottom: 6 }}>{f.label}</div>
              <div style={{ border: '1px solid #E7E4DE', borderRadius: 8, padding: '10px 14px', fontSize: 13, background: '#F7F5F2' }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Notifications</div>
        {[
          { key: 'order',     label: 'New order alerts'  },
          { key: 'stock',     label: 'Low stock alerts'  },
          { key: 'marketing', label: 'Marketing digest'  },
        ].map(n => {
          const on = notifPrefs[n.key];
          return (
            <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #EFEDE8' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{n.label}</div>
              <button onClick={() => toggleNotif(n.key)} style={{ width: 40, height: 22, borderRadius: 11, background: on ? '#181715' : '#E7E4DE', position: 'relative', cursor: 'pointer', border: 'none', padding: 0, flexShrink: 0 }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 21 : 3, transition: 'left 0.15s', display: 'block' }} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E7E4DE', borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Team Members</div>
        {TEAM.map(t => (
          <div key={t.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #EFEDE8' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F1EFEA', color: '#181715', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {t.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#A6A199' }}>{t.email}</div>
            </div>
            <div style={{ fontSize: 12, color: '#7C7870' }}>{t.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Order Detail Panel ─────────────────────────────────────────────────────── */

function OrderPanel({ order, statusOverrides, updateStatus, onClose, productImages }: {
  order: Order; statusOverrides: Record<string, OrderStatus>;
  updateStatus: (id: string, s: OrderStatus) => void; onClose: () => void;
  productImages: Record<string, string[]>;
}) {
  const [showRefundConfirm, setShowRefundConfirm] = useState(false);
  const currentStatus = statusOverrides[order.id] || order.status;
  const stepIdx = currentStatus === 'Cancelled' ? -1 : STATUS_STEPS.indexOf(currentStatus);

  const handlePrintInvoice = () => {
    const win = window.open('', '_blank', 'width=700,height=900');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.id}</title><style>
      body { font-family: 'Inter', sans-serif; padding: 48px; color: #181715; }
      h1 { font-size: 24px; font-weight: 800; margin: 0 0 4px; }
      .sub { font-size: 12px; color: #A6A199; margin-bottom: 32px; }
      .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #A6A199; margin: 24px 0 10px; }
      .customer-box { background: #F7F5F2; border-radius: 8px; padding: 14px 16px; font-size: 13px; line-height: 1.6; }
      table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 8px; }
      th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #A6A199; padding: 8px 0; border-bottom: 1px solid #EFEDE8; }
      td { padding: 10px 0; border-bottom: 1px solid #EFEDE8; }
      .total-row td { font-weight: 800; font-size: 15px; border: none; padding-top: 14px; }
      .muted { color: #7C7870; }
      @media print { body { padding: 24px; } }
    </style></head><body>
      <h1>TIVORA</h1><div class="sub">Invoice ${order.id} &nbsp;·&nbsp; ${order.date}</div>
      <div class="section-title">Bill To</div>
      <div class="customer-box">
        <strong>${order.customer}</strong><br>${order.email}<br>${order.address}
      </div>
      <div class="section-title">Items</div>
      <table>
        <thead><tr><th>Item</th><th>Variant</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th></tr></thead>
        <tbody>
          ${order.items.map(i => `<tr><td>${i.name}</td><td class="muted">${i.variant}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">Rs. ${(i.price * i.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>`).join('')}
        </tbody>
      </table>
      <table style="margin-top:16px">
        <tbody>
          <tr><td class="muted">Subtotal</td><td style="text-align:right">Rs. ${order.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td class="muted">Shipping</td><td style="text-align:right">Rs. ${order.shipping.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr><td class="muted">Tax</td><td style="text-align:right">Rs. ${order.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
          <tr class="total-row"><td>Total</td><td style="text-align:right">Rs. ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>
        </tbody>
      </table>
    </body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleRefund = () => {
    updateStatus(order.id, 'Cancelled');
    setShowRefundConfirm(false);
    onClose();
  };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,0.4)', zIndex: 20 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, height: '100vh', width: 480, background: '#fff', boxShadow: '-8px 0 24px rgba(0,0,0,0.08)', zIndex: 21, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #EFEDE8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800 }}>{order.id}</div>
            <div style={{ fontSize: 12, color: '#A6A199', marginTop: 2 }}>{order.date}</div>
          </div>
          <button onClick={onClose} style={{ cursor: 'pointer', fontSize: 20, color: '#A6A199', background: 'none', border: 'none' }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Status</div>
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 28 }}>
            {STATUS_STEPS.map((step, i) => {
              const done = i <= stepIdx;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < STATUS_STEPS.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => updateStatus(order.id, step)}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: done ? '#181715' : '#EFEDE8', border: `2px solid ${done ? '#181715' : '#E7E4DE'}` }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: done ? '#181715' : '#A6A199', whiteSpace: 'nowrap' }}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: i < stepIdx ? '#181715' : '#EFEDE8', margin: '0 4px', marginBottom: 18 }} />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Customer</div>
          <div style={{ background: '#F7F5F2', borderRadius: 10, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{order.customer}</div>
            <div style={{ fontSize: 13, color: '#7C7870', marginTop: 4 }}>{order.email}</div>
            <div style={{ fontSize: 13, color: '#7C7870', marginTop: 8, lineHeight: 1.5 }}>{order.address}</div>
          </div>

          <div style={{ fontSize: 12, fontWeight: 700, color: '#A6A199', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Items</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
            {order.items.map((item, i) => {
              const product = STOREFRONT_PRODUCTS.find(p => p.name === item.name);
              const img = product ? productImages[product.id]?.[0] : undefined;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 56, borderRadius: 6, flexShrink: 0, background: HATCH, overflow: 'hidden', position: 'relative' }}>
                    {img && <img src={img} alt={item.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: '#A6A199' }}>{item.variant} · Qty {item.qty}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{money(item.price * item.qty)}</div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid #EFEDE8', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[{ label: 'Subtotal', val: order.subtotal }, { label: 'Shipping', val: order.shipping }, { label: 'Tax', val: order.tax }].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#7C7870' }}>
                <span>{row.label}</span><span>{money(row.val)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, marginTop: 4 }}>
              <span>Total</span><span>{money(order.total)}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 28px', borderTop: '1px solid #EFEDE8', display: 'flex', gap: 10 }}>
          <button onClick={handlePrintInvoice} style={{ flex: 1, textAlign: 'center', border: '1px solid #E7E4DE', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff' }}>Print Invoice</button>
          <button onClick={() => setShowRefundConfirm(true)} disabled={currentStatus === 'Cancelled'} style={{ flex: 1, textAlign: 'center', background: currentStatus === 'Cancelled' ? '#EFEDE8' : '#A6402E', color: currentStatus === 'Cancelled' ? '#A6A199' : '#fff', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: currentStatus === 'Cancelled' ? 'default' : 'pointer' }}>
            {currentStatus === 'Cancelled' ? 'Refunded' : 'Refund Order'}
          </button>
        </div>
      </div>

      {showRefundConfirm && (
        <>
          <div onClick={() => setShowRefundConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(24,23,21,0.5)', zIndex: 40 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 360, background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', zIndex: 41, padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Refund {order.id}?</div>
            <div style={{ fontSize: 13, color: '#7C7870', marginBottom: 24, lineHeight: 1.6 }}>
              This will mark the order as <strong>Cancelled</strong> and cannot be undone.
              Total to refund: <strong>{money(order.total)}</strong>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowRefundConfirm(false)} style={{ flex: 1, border: '1px solid #E7E4DE', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: '#fff' }}>Cancel</button>
              <button onClick={handleRefund} style={{ flex: 1, background: '#A6402E', color: '#fff', border: 'none', borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Confirm Refund</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}


/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === '1') setAuthed(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [search, setSearch] = useState('');
  const changeScreen = (s: Screen) => { setScreen(s); setSearch(''); };
  const [orderFilter, setOrderFilter] = useState('All');
  const [productView, setProductView] = useState<'grid' | 'list'>('grid');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, OrderStatus>>({});
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({ order: true, stock: true, marketing: false });
  const [collections, setCollections] = useState<Collection[]>(BASE_COLLECTIONS);
  const [apiOrders, setApiOrders]       = useState<Order[]>([]);
  const [inventoryRows, setInventoryRows] = useState<{ sku: string; product: string; stock: number; reorder_at: number }[]>([]);
  const toggleCollection = (name: string) =>
    setCollections(prev => prev.map(c => c.name === name ? { ...c, active: !c.active } : c));

  const productImages        = useSharedStore(s => s.productImages);
  const setProductImages     = useSharedStore(s => s.setProductImages);
  const collectionBanners    = useSharedStore(s => s.collectionBanners);
  const setCollectionBanner  = useSharedStore(s => s.setCollectionBanner);

  // Fetch real data from API on mount
  useEffect(() => {
    // Load product images from Supabase
    fetch('/api/products')
      .then(r => r.json())
      .then((data: { id: string; images: string[] | null }[]) => {
        if (Array.isArray(data)) {
          data.forEach(p => { if (p.images?.length) setProductImages(p.id, p.images); });
        }
      })
      .catch(console.error);

    // Load real orders from Supabase
    fetch('/api/orders')
      .then(r => r.json())
      .then((data: { id: string; customer: string; email: string; address: string; payment: string; status: string; shipping: number; tax: number; subtotal: number; total: number; created_at: string; order_items: { product_name: string; qty: number; size: string; price: number }[] }[]) => {
        if (Array.isArray(data)) {
          const mapped: Order[] = data.map(o => ({
            id: o.id,
            customer: o.customer,
            email: o.email,
            date: o.created_at, // keep raw ISO timestamp for accurate date filtering
            address: o.address,
            items: (o.order_items ?? []).map(i => ({ name: i.product_name, variant: i.size, qty: i.qty, price: i.price })),
            payment: o.payment,
            status: o.status as OrderStatus,
            shipping: o.shipping,
            tax: o.tax,
            itemCount: (o.order_items ?? []).reduce((n, i) => n + i.qty, 0),
            subtotal: o.subtotal,
            total: o.total,
          }));
          setApiOrders(mapped);
        }
      })
      .catch(console.error);

    // Load inventory for low-stock alerts
    fetch('/api/inventory')
      .then(r => r.json())
      .then((data: { sku: string; products: { name: string }; variant: string; stock: number; reorder_at: number }[]) => {
        if (Array.isArray(data)) {
          setInventoryRows(data.map(r => ({ sku: r.sku, product: r.products?.name ?? '', stock: r.stock, reorder_at: r.reorder_at })));
        }
      })
      .catch(console.error);

    // Load collection banners
    fetch('/api/collections')
      .then(r => r.json())
      .then((data: { name: string; banner_url: string | null }[]) => {
        if (Array.isArray(data)) {
          data.forEach(c => { if (c.banner_url) setCollectionBanner(c.name, c.banner_url); });
        }
      })
      .catch(console.error);
  }, []);

  // Use real orders only once they've loaded; fall back to demo data while loading
  const apiIds = new Set(apiOrders.map(o => o.id));
  const allOrders: Order[] = apiOrders.length > 0 ? apiOrders : ORDERS;

  const updateSharedStatus = useSharedStore(s => s.updateOrderStatus);

  const getStatus = (id: string, def: OrderStatus): OrderStatus => {
    if (apiIds.has(id)) return (apiOrders.find(o => o.id === id)?.status as OrderStatus) || def;
    return statusOverrides[id] || def;
  };
  const updateStatus = (id: string, status: OrderStatus) => {
    if (apiIds.has(id)) {
      setApiOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }).catch(console.error);
    } else {
      setStatusOverrides(p => ({ ...p, [id]: status }));
    }
    updateSharedStatus(id, status);
  };

  const pendingCount   = allOrders.filter(o => getStatus(o.id, o.status) === 'Pending').length;
  const pendingOrders  = allOrders.filter(o => getStatus(o.id, o.status) === 'Pending');
  const lowStockItems = inventoryRows.filter(r => r.stock > 0 && r.stock <= r.reorder_at);
  const selectedOrder  = allOrders.find(o => o.id === selectedOrderId) ?? null;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F7F5F2', fontFamily: "'Inter', sans-serif", overflow: 'hidden' }}>
      <Sidebar screen={screen} setScreen={changeScreen} pendingCount={pendingCount} onLogout={onLogout} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopHeader screen={screen} search={search} setSearch={setSearch} pendingOrders={pendingOrders} lowStockItems={lowStockItems} onGoOrders={() => changeScreen('orders')} onGoInventory={() => changeScreen('inventory')} />
        <div style={{ flex: 1, padding: 36, overflowY: 'auto' }}>
          {screen === 'dashboard'   && <DashboardScreen orders={allOrders.map(o => ({ ...o, status: getStatus(o.id, o.status) }))} setScreen={changeScreen} />}
          {screen === 'orders'      && <OrdersScreen orders={allOrders} orderFilter={orderFilter} setOrderFilter={setOrderFilter} setSelectedOrderId={setSelectedOrderId} getStatus={getStatus} />}
          {screen === 'products'    && <ProductsScreen productView={productView} setProductView={setProductView} productImages={productImages} setProductImages={setProductImages} />}
          {screen === 'inventory'   && <InventoryScreen search={search} />}
          {screen === 'collections' && <CollectionsScreen collections={collections} collectionBanners={collectionBanners} setCollectionBanner={setCollectionBanner} toggleCollection={toggleCollection} />}
          {screen === 'customers'   && <CustomersScreen orders={allOrders} />}
          {screen === 'analytics'   && <AnalyticsScreen orders={allOrders} />}
          {screen === 'settings'    && <SettingsScreen notifPrefs={notifPrefs} toggleNotif={key => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))} />}
        </div>
      </div>

      {selectedOrder && (
        <OrderPanel order={selectedOrder} statusOverrides={statusOverrides} updateStatus={updateStatus} onClose={() => setSelectedOrderId(null)} productImages={productImages} />
      )}
    </div>
  );
}