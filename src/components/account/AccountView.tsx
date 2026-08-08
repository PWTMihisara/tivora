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

export interface Address {
  id: string; user_id: string; label: string; name: string;
  address: string; city: string; zip: string; phone: string; is_default: boolean;
}

const STATUS_COLOR: Record<OrderStatus, { bg: string; text: string }> = {
  Pending:    { bg: '#F5F3F0', text: '#6b6b6b' },
  Processing: { bg: '#FEF3E2', text: '#92610A' },
  Shipped:    { bg: '#EEF2FF', text: '#3730A3' },
  Delivered:  { bg: '#EAF3EC', text: '#2F6B45' },
  Cancelled:  { bg: '#FBEAE7', text: '#A6402E' },
};

const money   = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const ORDER_TABS: { key: OrderTab; label: string; icon: React.ReactNode }[] = [
  { key: 'All Orders', label: 'All Orders', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="1"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { key: 'Processing', label: 'Processing', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
  { key: 'Shipped',    label: 'Shipped',    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
  { key: 'Delivered',  label: 'Delivered',  icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { key: 'Returns',    label: 'Returns',    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg> },
];

const EMPTY_FORM = { label: '', name: '', address: '', city: '', zip: '', phone: '', is_default: false };

function AddressForm({ initial, onSave, onCancel, saving }: {
  initial: typeof EMPTY_FORM;
  onSave: (data: typeof EMPTY_FORM) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const field = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const inp: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    border: '1px solid rgba(10,10,10,0.18)', padding: '11px 14px',
    fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff',
  };

  return (
    <div style={{ background: '#f9f8f6', border: '1px solid rgba(10,10,10,0.1)', padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="addr-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 7 }}>ADDRESS LABEL</div>
          <input value={form.label} onChange={field('label')} placeholder="e.g. Home, Office" style={inp} />
        </div>
        <div>
          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 7 }}>RECIPIENT NAME</div>
          <input value={form.name} onChange={field('name')} placeholder="Full name" style={inp} />
        </div>
      </div>
      <div>
        <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 7 }}>ADDRESS</div>
        <input value={form.address} onChange={field('address')} placeholder="123 Main Street" style={inp} />
      </div>
      <div className="addr-form-3col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div>
          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 7 }}>CITY</div>
          <input value={form.city} onChange={field('city')} placeholder="Colombo" style={inp} />
        </div>
        <div>
          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 7 }}>ZIP</div>
          <input value={form.zip} onChange={field('zip')} placeholder="00100" style={inp} />
        </div>
        <div>
          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 7 }}>PHONE</div>
          <input value={form.phone} onChange={field('phone')} placeholder="+94 77 000 0000" style={inp} />
        </div>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', font: "500 13px 'Inter',sans-serif" }}>
        <input type="checkbox" checked={form.is_default} onChange={field('is_default')} />
        Set as default address
      </label>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={() => onSave(form)} disabled={saving} style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '12px 24px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'SAVING…' : 'SAVE ADDRESS'}
        </button>
        <button onClick={onCancel} style={{ background: 'none', border: '1px solid rgba(10,10,10,0.2)', padding: '12px 20px', font: "600 12px/1 'Inter',sans-serif", cursor: 'pointer', color: '#6b6b6b' }}>
          CANCEL
        </button>
      </div>
    </div>
  );
}

export default function AccountView() {
  const user    = useStore(s => s.user);
  const setUser = useStore(s => s.setUser);
  const goHome  = useStore(s => s.goHome);

  const [tab, setTab]           = useState<'profile' | 'orders'>('orders');
  const [orderTab, setOrderTab] = useState<OrderTab>('All Orders');
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Addresses
  const [addresses, setAddresses]   = useState<Address[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [savingAddr, setSavingAddr]   = useState(false);

  // Profile edit
  const [editName, setEditName]         = useState(user?.name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg]     = useState('');

  useEffect(() => {
    if (!user?.email) return;
    fetch(`/api/account/orders?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json()).then((d: Order[]) => { if (Array.isArray(d)) setOrders(d); })
      .catch(console.error).finally(() => setLoadingOrders(false));
  }, [user?.email]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/account/addresses?user_id=${user.id}`)
      .then(r => r.json()).then((d: Address[]) => { if (Array.isArray(d)) setAddresses(d); })
      .catch(console.error).finally(() => setLoadingAddr(false));
  }, [user?.id]);

  const handleSignOut = async () => { await supabase.auth.signOut(); setUser(null); goHome(); };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSavingProfile(true);
    const { error } = await supabase.auth.updateUser({ data: { name: editName } });
    if (!error && user) setUser({ ...user, name: editName });
    setProfileMsg(error ? 'Failed.' : 'Saved!');
    setSavingProfile(false);
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handleAddAddress = async (form: typeof EMPTY_FORM) => {
    if (!user?.id) return;
    setSavingAddr(true);
    const res = await fetch('/api/account/addresses', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: user.id }),
    });
    const data: Address = await res.json();
    if (res.ok) {
      setAddresses(prev => form.is_default ? prev.map(a => ({ ...a, is_default: false })).concat(data) : [...prev, data]);
      setShowAddForm(false);
    }
    setSavingAddr(false);
  };

  const handleEditAddress = async (form: typeof EMPTY_FORM) => {
    if (!editingAddr) return;
    setSavingAddr(true);
    const res = await fetch(`/api/account/addresses/${editingAddr.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, user_id: user?.id }),
    });
    const data: Address = await res.json();
    if (res.ok) {
      setAddresses(prev => {
        const updated = prev.map(a => a.id === editingAddr.id ? data : form.is_default ? { ...a, is_default: false } : a);
        return updated.map(a => a.id === editingAddr.id ? data : a);
      });
      setEditingAddr(null);
    }
    setSavingAddr(false);
  };

  const handleDeleteAddress = async (id: string) => {
    await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSetDefault = async (addr: Address) => {
    const res = await fetch(`/api/account/addresses/${addr.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_default: true, user_id: user?.id }),
    });
    if (res.ok) setAddresses(prev => prev.map(a => ({ ...a, is_default: a.id === addr.id })));
  };

  const visibleOrders = orderTab === 'All Orders' ? orders
    : orderTab === 'Returns' ? orders.filter(o => o.status === 'Cancelled')
    : orders.filter(o => o.status === orderTab);

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <main className="account-main" style={{ maxWidth: 900, margin: '0 auto', padding: '56px 48px 96px' }}>
      {/* Header */}
      <div className="account-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 18px/1 'Archivo',sans-serif", flexShrink: 0 }}>{initials}</div>
          <div>
            <div style={{ font: "700 20px/1 'Archivo',sans-serif", marginBottom: 4 }}>{user?.name}</div>
            <div style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>{user?.email}</div>
          </div>
        </div>
        <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid rgba(10,10,10,0.2)', padding: '10px 20px', font: "600 12px/1 'Inter',sans-serif", letterSpacing: '0.08em', cursor: 'pointer', color: '#6b6b6b', flexShrink: 0, borderRadius: 24 }}>SIGN OUT</button>
      </div>

      {/* Main tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(10,10,10,0.12)', marginBottom: 40 }}>
        {(['orders', 'profile'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px', marginRight: 32, font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: tab === t ? '#0a0a0a' : '#9a9a96', borderBottom: tab === t ? '2px solid #0a0a0a' : '2px solid transparent', marginBottom: -1, textTransform: 'uppercase' }}>
            {t === 'orders' ? 'ORDER HISTORY' : 'PROFILE & ADDRESSES'}
          </button>
        ))}
      </div>

      {/* ── ORDER HISTORY ── */}
      {tab === 'orders' && (
        <div>
          <div className="account-order-tabs" style={{ display: 'flex', borderBottom: '1px solid rgba(10,10,10,0.10)', marginBottom: 36 }}>
            {ORDER_TABS.map(({ key, label, icon }) => {
              const active = orderTab === key;
              return (
                <button key={key} onClick={() => setOrderTab(key)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 8px', color: active ? '#0a0a0a' : '#b0b0aa', borderBottom: active ? '2px solid #0a0a0a' : '2px solid transparent', marginBottom: -1, transition: 'color 0.2s' }}>
                  {icon}
                  <span style={{ font: "500 12px/1 'Inter',sans-serif", letterSpacing: '0.04em' }}>{label}</span>
                </button>
              );
            })}
          </div>

          {loadingOrders ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#9a9a96' }}>Loading orders…</div>
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
                  <div key={order.id} style={{ border: '1px solid rgba(10,10,10,0.12)', background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
                    <button onClick={() => setExpanded(isOpen ? null : order.id)} style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 24px', textAlign: 'left' }}>
                      <div className="account-order-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <div className="account-order-meta" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                          {[['ORDER', order.id], ['DATE', fmtDate(order.created_at)], ['ITEMS', String(order.order_items?.length ?? 0)], ['TOTAL', money(order.total)]].map(([l, v]) => (
                            <div key={l}>
                              <div style={{ font: "600 13px/1 'Inter',sans-serif", color: '#9a9a96', marginBottom: 4 }}>{l}</div>
                              <div style={{ font: l === 'TOTAL' ? "700 15px/1 'Inter',sans-serif" : "500 14px/1 'Inter',sans-serif" }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <span style={{ padding: '5px 12px', borderRadius: 20, background: sc.bg, color: sc.text, font: "700 12px/1 'Inter',sans-serif" }}>{order.status}</span>
                          <span style={{ font: "400 18px 'Inter',sans-serif", color: '#9a9a96', transform: isOpen ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
                        </div>
                      </div>
                    </button>
                    {isOpen && (
                      <div style={{ borderTop: '1px solid rgba(10,10,10,0.08)', padding: '20px 24px' }}>
                        <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#9a9a96', marginBottom: 14 }}>ORDER ITEMS</div>
                        {(order.order_items ?? []).map((item, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(10,10,10,0.06)' }}>
                            <div>
                              <div style={{ font: "600 14px/1 'Inter',sans-serif", marginBottom: 4 }}>{item.product_name}</div>
                              <div style={{ font: "400 13px/1 'Inter',sans-serif", color: '#6b6b6b' }}>Size: {item.size} · Qty: {item.qty}</div>
                            </div>
                            <div style={{ font: "600 14px/1 'Inter',sans-serif" }}>{money(item.price * item.qty)}</div>
                          </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 280, marginLeft: 'auto', marginTop: 16 }}>
                          {[['Subtotal', money(order.subtotal)], order.shipping > 0 && ['Shipping', money(order.shipping)], order.tax > 0 && ['Tax', money(order.tax)]].filter(Boolean).map(([l, v]) => (
                            <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px/1 'Inter',sans-serif", color: '#6b6b6b' }}><span>{l}</span><span>{v}</span></div>
                          ))}
                          <div style={{ display: 'flex', justifyContent: 'space-between', font: "700 15px/1 'Inter',sans-serif", paddingTop: 10, borderTop: '1px solid rgba(10,10,10,0.12)', marginTop: 4 }}><span>Total</span><span>{money(order.total)}</span></div>
                        </div>
                        {order.address && <div style={{ marginTop: 16, font: "400 13px/1.5 'Inter',sans-serif", color: '#6b6b6b' }}><span style={{ fontWeight: 600, color: '#0a0a0a' }}>Delivery: </span>{order.address}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PROFILE & ADDRESSES ── */}
      {tab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {/* Profile section */}
          <div style={{ maxWidth: 440 }}>
            <div style={{ font: "700 11px/1 'Inter',sans-serif", letterSpacing: '0.12em', color: '#9a9a96', marginBottom: 20 }}>PERSONAL INFO</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>FULL NAME</div>
                <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', border: '1px solid rgba(10,10,10,0.18)', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }} />
              </div>
              <div>
                <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 8 }}>EMAIL</div>
                <input value={user?.email ?? ''} disabled style={{ width: '100%', boxSizing: 'border-box', border: '1px solid rgba(10,10,10,0.18)', padding: '11px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#f5f5f3', color: '#9a9a96' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button onClick={handleSaveProfile} disabled={savingProfile} style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '12px 24px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', cursor: 'pointer', opacity: savingProfile ? 0.6 : 1 }}>{savingProfile ? 'SAVING…' : 'SAVE'}</button>
                {profileMsg && <span style={{ font: "500 13px 'Inter',sans-serif", color: '#2F6B45' }}>{profileMsg}</span>}
              </div>
            </div>
          </div>

          {/* Addresses section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ font: "700 11px/1 'Inter',sans-serif", letterSpacing: '0.12em', color: '#9a9a96' }}>SAVED ADDRESSES</div>
              {!showAddForm && (
                <button onClick={() => { setShowAddForm(true); setEditingAddr(null); }} style={{ background: 'none', border: '1px solid rgba(10,10,10,0.2)', padding: '8px 18px', font: "600 12px/1 'Inter',sans-serif", letterSpacing: '0.06em', cursor: 'pointer' }}>+ ADD ADDRESS</button>
              )}
            </div>

            {/* Add form */}
            {showAddForm && (
              <div style={{ marginBottom: 20 }}>
                <AddressForm initial={EMPTY_FORM} onSave={handleAddAddress} onCancel={() => setShowAddForm(false)} saving={savingAddr} />
              </div>
            )}

            {/* Address cards */}
            {loadingAddr ? (
              <div style={{ color: '#9a9a96', font: "400 14px 'Inter',sans-serif" }}>Loading…</div>
            ) : addresses.length === 0 && !showAddForm ? (
              <div style={{ padding: '32px 0', color: '#9a9a96', font: "400 14px 'Inter',sans-serif" }}>No saved addresses yet.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {addresses.map(addr => (
                  <div key={addr.id}>
                    {editingAddr?.id === addr.id ? (
                      <AddressForm
                        initial={{ label: addr.label, name: addr.name, address: addr.address, city: addr.city, zip: addr.zip, phone: addr.phone, is_default: addr.is_default }}
                        onSave={handleEditAddress}
                        onCancel={() => setEditingAddr(null)}
                        saving={savingAddr}
                      />
                    ) : (
                      <div style={{ border: `1.5px solid ${addr.is_default ? '#0a0a0a' : 'rgba(10,10,10,0.12)'}`, padding: 20, background: '#fff', position: 'relative' }}>
                        {addr.is_default && (
                          <div style={{ position: 'absolute', top: 14, right: 14, font: "700 10px/1 'Inter',sans-serif", letterSpacing: '0.08em', background: '#0a0a0a', color: '#fff', padding: '3px 8px' }}>DEFAULT</div>
                        )}
                        {addr.label && <div style={{ font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 10 }}>{addr.label.toUpperCase()}</div>}
                        <div style={{ font: "600 14px/1 'Inter',sans-serif", marginBottom: 6 }}>{addr.name}</div>
                        <div style={{ font: "400 13px/1.6 'Inter',sans-serif", color: '#4a4a48' }}>
                          {addr.address}<br />
                          {[addr.city, addr.zip].filter(Boolean).join(', ')}<br />
                          {addr.phone}
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                          <button onClick={() => setEditingAddr(addr)} style={{ background: 'none', border: 'none', font: "600 12px 'Inter',sans-serif", cursor: 'pointer', color: '#0a0a0a', padding: 0, textDecoration: 'underline' }}>Edit</button>
                          {!addr.is_default && <button onClick={() => handleSetDefault(addr)} style={{ background: 'none', border: 'none', font: "600 12px 'Inter',sans-serif", cursor: 'pointer', color: '#6b6b6b', padding: 0, textDecoration: 'underline' }}>Set default</button>}
                          <button onClick={() => handleDeleteAddress(addr.id)} style={{ background: 'none', border: 'none', font: "600 12px 'Inter',sans-serif", cursor: 'pointer', color: '#b02a2a', padding: 0, marginLeft: 'auto', textDecoration: 'underline' }}>Remove</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
