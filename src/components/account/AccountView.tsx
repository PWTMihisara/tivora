'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
type OrderTab = 'All Orders' | 'Processing' | 'Shipped' | 'Delivered' | 'Returns';

interface OrderItem { product_name: string; size: string; qty: number; price: number }
interface Order {
  id: string; status: OrderStatus; created_at: string;
  subtotal: number; shipping: number; tax: number; total: number;
  address: string; order_items: OrderItem[];
}

const STATUS_COLOR: Record<OrderStatus, { bg: string; text: string }> = {
  Pending:    { bg: '#F5F3F0', text: '#6b6b6b' },
  Processing: { bg: '#FEF3E2', text: '#92610A' },
  Shipped:    { bg: '#EEF2FF', text: '#3730A3' },
  Delivered:  { bg: '#EAF3EC', text: '#2F6B45' },
  Cancelled:  { bg: '#FBEAE7', text: '#A6402E' },
};

const money = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const ORDER_TABS: { key: OrderTab; label: string; icon: React.ReactNode }[] = [
  {
    key: 'All Orders', label: 'All Orders',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="1"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  },
  {
    key: 'Processing', label: 'Processing',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  },
  {
    key: 'Shipped', label: 'Shipped',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  },
  {
    key: 'Delivered', label: 'Delivered',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
  {
    key: 'Returns', label: 'Returns',
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>,
  },
];

export default function AccountView() {
  const user    = useStore(s => s.user);
  const setUser = useStore(s => s.setUser);
  const goHome  = useStore(s => s.goHome);

  const [tab, setTab]           = useState<'profile' | 'orders'>('orders');
  const [orderTab, setOrderTab] = useState<OrderTab>('All Orders');
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Profile edit state
  const [editName, setEditName]     = useState(user?.name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  useEffect(() => {
    if (!user?.email) return;
    setLoadingOrders(true);
    fetch(`/api/account/orders?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then((data: Order[]) => { if (Array.isArray(data)) setOrders(data); })
      .catch(console.error)
      .finally(() => setLoadingOrders(false));
  }, [user?.email]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    goHome();
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { name: editName } });
    if (!error && user) setUser({ ...user, name: editName });
    setProfileMsg(error ? 'Failed to save.' : 'Saved!');
    setSavingProfile(false);
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const visibleOrders = orderTab === 'All Orders'
    ? orders
    : orderTab === 'Returns'
    ? orders.filter(o => o.status === 'Cancelled')
    : orders.filter(o => o.status === orderTab);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  const inputSty: React.CSSProperties = {
    border: '1px solid rgba(10,10,10,0.18)', padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', outline: 'none',
    background: '#fff', width: '100%', boxSizing: 'border-box',
  };

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '56px 48px 96px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 18px/1 'Archivo',sans-serif" }}>
            {initials}
          </div>
          <div>
            <div style={{ font: "700 20px/1 'Archivo',sans-serif", marginBottom: 4 }}>{user?.name}</div>
            <div style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>{user?.email}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          style={{ background: 'none', border: '1px solid rgba(10,10,10,0.2)', padding: '10px 20px', font: "600 12px/1 'Inter',sans-serif", letterSpacing: '0.08em', cursor: 'pointer', color: '#6b6b6b' }}
        >SIGN OUT</button>
      </div>

      {/* Main tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(10,10,10,0.12)', marginBottom: 40 }}>
        {(['orders', 'profile'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0 0 16px', marginRight: 32,
              font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em',
              color: tab === t ? '#0a0a0a' : '#9a9a96',
              borderBottom: tab === t ? '2px solid #0a0a0a' : '2px solid transparent',
              marginBottom: -1,
              textTransform: 'uppercase',
            }}
          >{t === 'orders' ? 'ORDER HISTORY' : 'PROFILE'}</button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <div>
          {/* Order status tabs — icon + label */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(10,10,10,0.10)', marginBottom: 36 }}>
            {ORDER_TABS.map(({ key, label, icon }) => {
              const active = orderTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setOrderTab(key)}
                  style={{
                    flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    padding: '20px 8px',
                    color: active ? '#0a0a0a' : '#b0b0aa',
                    borderBottom: active ? '2px solid #0a0a0a' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'color 0.2s',
                  }}
                >
                  {icon}
                  <span style={{ font: "500 12px/1 'Inter',sans-serif", letterSpacing: '0.04em' }}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Orders list */}
          {loadingOrders ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#9a9a96', font: "400 14px 'Inter',sans-serif" }}>Loading orders…</div>
          ) : visibleOrders.length === 0 ? (
            <div style={{ padding: '64px 0', textAlign: 'center' }}>
              <div style={{ font: "600 16px 'Archivo',sans-serif", marginBottom: 8 }}>No {orderTab.toLowerCase()} yet</div>
              <div style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>Your orders will appear here once placed.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {visibleOrders.map(order => {
                const isOpen = expanded === order.id;
                const sc = STATUS_COLOR[order.status] ?? STATUS_COLOR.Pending;
                return (
                  <div key={order.id} style={{ border: '1px solid rgba(10,10,10,0.12)', background: '#fff' }}>
                    {/* Order row */}
                    <button
                      onClick={() => setExpanded(isOpen ? null : order.id)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 24px', textAlign: 'left' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ font: "600 13px/1 'Inter',sans-serif", color: '#9a9a96', marginBottom: 4 }}>ORDER</div>
                            <div style={{ font: "700 15px/1 'Archivo',sans-serif" }}>{order.id}</div>
                          </div>
                          <div>
                            <div style={{ font: "600 13px/1 'Inter',sans-serif", color: '#9a9a96', marginBottom: 4 }}>DATE</div>
                            <div style={{ font: "500 14px/1 'Inter',sans-serif" }}>{fmtDate(order.created_at)}</div>
                          </div>
                          <div>
                            <div style={{ font: "600 13px/1 'Inter',sans-serif", color: '#9a9a96', marginBottom: 4 }}>ITEMS</div>
                            <div style={{ font: "500 14px/1 'Inter',sans-serif" }}>{order.order_items?.length ?? 0}</div>
                          </div>
                          <div>
                            <div style={{ font: "600 13px/1 'Inter',sans-serif", color: '#9a9a96', marginBottom: 4 }}>TOTAL</div>
                            <div style={{ font: "700 15px/1 'Inter',sans-serif" }}>{money(order.total)}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ padding: '5px 12px', borderRadius: 20, background: sc.bg, color: sc.text, font: "700 12px/1 'Inter',sans-serif" }}>
                            {order.status}
                          </span>
                          <span style={{ font: "400 18px 'Inter',sans-serif", color: '#9a9a96', transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
                        </div>
                      </div>
                    </button>

                    {/* Expanded details */}
                    {isOpen && (
                      <div style={{ borderTop: '1px solid rgba(10,10,10,0.08)', padding: '20px 24px' }}>
                        <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#9a9a96', marginBottom: 14 }}>ORDER ITEMS</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                          {(order.order_items ?? []).map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                              <div>
                                <div style={{ font: "600 14px/1 'Inter',sans-serif", marginBottom: 4 }}>{item.product_name}</div>
                                <div style={{ font: "400 13px/1 'Inter',sans-serif", color: '#6b6b6b' }}>Size: {item.size} · Qty: {item.qty}</div>
                              </div>
                              <div style={{ font: "600 14px/1 'Inter',sans-serif" }}>{money(item.price * item.qty)}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: 280, marginLeft: 'auto', flexDirection: 'column', gap: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px/1 'Inter',sans-serif", color: '#6b6b6b' }}>
                            <span>Subtotal</span><span>{money(order.subtotal)}</span>
                          </div>
                          {order.shipping > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px/1 'Inter',sans-serif", color: '#6b6b6b' }}>
                              <span>Shipping</span><span>{money(order.shipping)}</span>
                            </div>
                          )}
                          {order.tax > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px/1 'Inter',sans-serif", color: '#6b6b6b' }}>
                              <span>Tax</span><span>{money(order.tax)}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', font: "700 15px/1 'Inter',sans-serif", marginTop: 8, paddingTop: 10, borderTop: '1px solid rgba(10,10,10,0.12)' }}>
                            <span>Total</span><span>{money(order.total)}</span>
                          </div>
                        </div>
                        {order.address && (
                          <div style={{ marginTop: 16, font: "400 13px/1.5 'Inter',sans-serif", color: '#6b6b6b' }}>
                            <span style={{ fontWeight: 600, color: '#0a0a0a' }}>Delivery: </span>{order.address}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {tab === 'profile' && (
        <div style={{ maxWidth: 440 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>FULL NAME</div>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputSty} />
            </div>
            <div>
              <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>EMAIL</div>
              <input type="email" value={user?.email ?? ''} disabled style={{ ...inputSty, background: '#f5f5f3', color: '#9a9a96' }} />
              <div style={{ font: "400 12px 'Inter',sans-serif", color: '#9a9a96', marginTop: 6 }}>Email cannot be changed.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '14px 28px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', cursor: 'pointer', opacity: savingProfile ? 0.6 : 1 }}
              >{savingProfile ? 'SAVING…' : 'SAVE CHANGES'}</button>
              {profileMsg && <span style={{ font: "500 13px 'Inter',sans-serif", color: '#2F6B45' }}>{profileMsg}</span>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
