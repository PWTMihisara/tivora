'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderItem { product_name: string; size: string; qty: number; price: number }
interface TrackingOrder {
  id: string; status: OrderStatus; created_at: string;
  customer: string; email: string; address: string;
  subtotal: number; shipping: number; tax: number; total: number;
  order_items: OrderItem[];
}

const STEPS: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const STEP_META: Record<string, { icon: string; label: string; desc: string }> = {
  Pending:    { icon: '📋', label: 'Order Placed',    desc: 'Your order has been received and is awaiting processing.' },
  Processing: { icon: '📦', label: 'Processing',     desc: 'We are carefully preparing your items for shipment.' },
  Shipped:    { icon: '🚚', label: 'Shipped',         desc: 'Your package is on its way to you.' },
  Delivered:  { icon: '✅', label: 'Delivered',       desc: 'Your order has been delivered. Enjoy!' },
};

const money = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export default function TrackingView() {
  const trackingOrderId = useStore(s => s.trackingOrderId);
  const goAccount       = useStore(s => s.goAccount);
  const [order, setOrder]   = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trackingOrderId) return;
    fetch(`/api/orders/${trackingOrderId}`)
      .then(r => r.json())
      .then(data => { if (data && !data.error) setOrder(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [trackingOrderId]);

  if (loading) {
    return (
      <main style={{ padding: '96px 48px', textAlign: 'center' }}>
        <div style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>Loading order...</div>
      </main>
    );
  }

  if (!order) {
    return (
      <main style={{ padding: '96px 48px', textAlign: 'center' }}>
        <div style={{ font: "600 16px 'Inter',sans-serif", marginBottom: 16 }}>Order not found</div>
        <button onClick={goAccount} style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '12px 28px', font: "700 12px 'Inter',sans-serif", letterSpacing: '0.1em', cursor: 'pointer' }}>
          BACK TO ACCOUNT
        </button>
      </main>
    );
  }

  const isCancelled = order.status === 'Cancelled';
  const currentIdx = isCancelled ? -1 : STEPS.indexOf(order.status);

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '56px 48px 96px' }}>
      {/* Back button */}
      <button
        onClick={goAccount}
        style={{ background: 'none', border: 'none', cursor: 'pointer', font: "600 12px 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6 }}
      >
        ← BACK TO ORDERS
      </button>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ font: "600 11px 'Inter',sans-serif", letterSpacing: '0.14em', color: '#9a9a96', marginBottom: 8 }}>ORDER TRACKING</div>
        <h1 style={{ font: "800 28px 'Archivo',sans-serif", margin: '0 0 8px', letterSpacing: '-0.01em' }}>{order.id}</h1>
        <div style={{ font: "400 13px 'Inter',sans-serif", color: '#6b6b6b' }}>Placed on {fmtDate(order.created_at)}</div>
      </div>

      {/* Status badge */}
      {isCancelled && (
        <div style={{ background: '#FBEAE7', color: '#A6402E', font: "700 12px 'Inter',sans-serif", padding: '12px 20px', borderRadius: 8, marginBottom: 32, letterSpacing: '0.06em' }}>
          This order has been cancelled.
        </div>
      )}

      {/* Timeline */}
      {!isCancelled && (
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', position: 'relative' }}>
            {/* Progress bar background */}
            <div style={{ position: 'absolute', top: 20, left: '12.5%', right: '12.5%', height: 3, background: '#e7e5e0', borderRadius: 2 }} />
            {/* Progress bar fill */}
            <div style={{ position: 'absolute', top: 20, left: '12.5%', height: 3, background: '#0a0a0a', borderRadius: 2, width: `${(currentIdx / (STEPS.length - 1)) * 75}%`, transition: 'width 0.5s ease' }} />

            {STEPS.map((step, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              const meta = STEP_META[step];
              return (
                <div key={step} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px',
                    background: done ? '#0a0a0a' : '#fff',
                    border: `2px solid ${done ? '#0a0a0a' : '#e7e5e0'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    boxShadow: active ? '0 0 0 4px rgba(10,10,10,0.15)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
                    {done ? <span style={{ filter: 'none' }}>{meta.icon}</span> : <span style={{ opacity: 0.3 }}>{meta.icon}</span>}
                  </div>
                  <div style={{ font: `${done ? 700 : 500} 11px 'Inter',sans-serif`, letterSpacing: '0.06em', color: done ? '#0a0a0a' : '#9a9a96', marginBottom: 4 }}>
                    {meta.label.toUpperCase()}
                  </div>
                  {active && (
                    <div style={{ font: "400 11px/1.5 'Inter',sans-serif", color: '#6b6b6b', maxWidth: 140, margin: '4px auto 0' }}>
                      {meta.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
        <div style={{ background: '#f5f3f0', borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.12em', color: '#9a9a96', marginBottom: 10 }}>SHIPPING TO</div>
          <div style={{ font: "600 14px 'Inter',sans-serif", marginBottom: 4 }}>{order.customer}</div>
          <div style={{ font: "400 13px/1.5 'Inter',sans-serif", color: '#6b6b6b' }}>{order.address}</div>
        </div>
        <div style={{ background: '#f5f3f0', borderRadius: 10, padding: '20px 24px' }}>
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.12em', color: '#9a9a96', marginBottom: 10 }}>ORDER SUMMARY</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px 'Inter',sans-serif", color: '#6b6b6b', marginBottom: 4 }}>
            <span>Subtotal</span><span>{money(order.subtotal)}</span>
          </div>
          {order.shipping > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px 'Inter',sans-serif", color: '#6b6b6b', marginBottom: 4 }}>
              <span>Shipping</span><span>{money(order.shipping)}</span>
            </div>
          )}
          {order.tax > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', font: "400 13px 'Inter',sans-serif", color: '#6b6b6b', marginBottom: 4 }}>
              <span>Tax</span><span>{money(order.tax)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', font: "700 15px 'Inter',sans-serif", borderTop: '1px solid rgba(10,10,10,0.1)', paddingTop: 8, marginTop: 8 }}>
            <span>Total</span><span>{money(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.12em', color: '#9a9a96', marginBottom: 14 }}>ITEMS</div>
      <div style={{ border: '1px solid rgba(10,10,10,0.1)', borderRadius: 10, overflow: 'hidden' }}>
        {order.order_items.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: i < order.order_items.length - 1 ? '1px solid rgba(10,10,10,0.08)' : 'none' }}>
            <div>
              <div style={{ font: "600 14px 'Inter',sans-serif", marginBottom: 3 }}>{item.product_name}</div>
              <div style={{ font: "400 12px 'Inter',sans-serif", color: '#6b6b6b' }}>Size {item.size} · Qty {item.qty}</div>
            </div>
            <div style={{ font: "600 14px 'Inter',sans-serif" }}>{money(item.price * item.qty)}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
