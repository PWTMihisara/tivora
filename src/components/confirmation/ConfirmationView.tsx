'use client';

import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { money } from '@/data/products';

export default function ConfirmationView() {
  const goHome      = useStore(s => s.goHome);
  const lastOrder   = useStore(s => s.lastOrder);
  const productImages = useSharedStore(s => s.productImages);

  const items = lastOrder?.items ?? [];
  const subtotal = lastOrder?.subtotal ?? 0;
  const tax = lastOrder?.tax ?? 0;
  const total = lastOrder?.total ?? 0;
  const firstName = lastOrder?.customerName?.split(' ')[0] ?? 'there';

  return (
    <main style={{ minHeight: 'calc(100vh - 88px)', background: '#f5f4f2', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 48px rgba(10,10,10,0.08)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
        width: '100%',
        maxWidth: 860,
      }} className="confirm-grid">

        {/* LEFT — success */}
        <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRight: '1px solid #f0ede8' }}>

          {/* Green check circle */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            border: '2.5px solid #22c55e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 28,
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{ font: "800 26px/1.2 'Archivo',sans-serif", margin: '0 0 28px', letterSpacing: '-0.01em', color: '#0a0a0a' }}>
            Thank you for<br />your order
          </h1>

          {/* Confirmation box */}
          <div style={{ background: '#f5f4f2', borderRadius: 12, padding: '20px 28px', width: '100%', marginBottom: 32 }}>
            <p style={{ font: "600 15px 'Inter',sans-serif", color: '#0a0a0a', margin: '0 0 8px' }}>
              Order confirmed, {firstName}!
            </p>
            <p style={{ font: "400 13px/1.5 'Inter',sans-serif", color: '#8a8a86', margin: 0 }}>
              A confirmation has been sent to your email.
            </p>
            <p style={{ font: "400 13px/1.5 'Inter',sans-serif", color: '#8a8a86', margin: '4px 0 0' }}>
              We&apos;ll notify you when your order ships.
            </p>
          </div>

          <button
            onClick={goHome}
            style={{
              background: '#0a0a0a', color: '#fff', border: 'none',
              padding: '14px 32px', width: '100%',
              font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer',
              borderRadius: 8,
            }}
          >
            CONTINUE SHOPPING
          </button>
        </div>

        {/* RIGHT — order items */}
        <div style={{ padding: '40px 40px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {items.map((item, i) => {
              const img = productImages[item.id]?.[0];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, marginBottom: 20, borderBottom: i < items.length - 1 ? '1px solid #f0ede8' : 'none' }}>
                  {/* Product image */}
                  <div style={{
                    width: 72, height: 72, borderRadius: 8, flexShrink: 0, overflow: 'hidden',
                    background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 6px,#dcd9d2 6px,#dcd9d2 12px)',
                  }}>
                    {img && <img src={img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>

                  {/* Name + size */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "600 13px 'Inter',sans-serif", color: '#0a0a0a', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ font: "400 12px 'Inter',sans-serif", color: '#8a8a86' }}>
                      Size {item.size} · Qty {item.qty}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    {item.originalPrice ? (
                      <>
                        <div style={{ font: "600 14px 'Inter',sans-serif", color: '#A6402E' }}>
                          {money(item.price * item.qty)}
                        </div>
                        <div style={{ font: "400 11px 'Inter',sans-serif", color: '#9a9a96', textDecoration: 'line-through' }}>
                          {money(item.originalPrice * item.qty)}
                        </div>
                        <div style={{ font: "700 9px/1 'Inter',sans-serif", background: '#A6402E', color: '#fff', padding: '2px 6px', borderRadius: 3, marginTop: 3, display: 'inline-block' }}>
                          {item.discountLabel}
                        </div>
                      </>
                    ) : (
                      <div style={{ font: "600 14px 'Inter',sans-serif", color: '#0a0a0a' }}>
                        {money(item.price * item.qty)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={{ borderTop: '1px solid #f0ede8', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#8a8a86' }}>Subtotal</span>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#0a0a0a' }}>{money(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#8a8a86' }}>Tax (5%)</span>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#0a0a0a' }}>{money(tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#8a8a86' }}>Shipping</span>
              <span style={{ font: "400 13px 'Inter',sans-serif", color: '#0a0a0a' }}>Complimentary</span>
            </div>
          </div>
          <div style={{ borderTop: '1.5px solid #0a0a0a', marginTop: 12, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: "600 13px 'Inter',sans-serif", color: '#0a0a0a', letterSpacing: '0.05em' }}>Total</span>
            <span style={{ font: "800 22px 'Archivo',sans-serif", color: '#0a0a0a', letterSpacing: '-0.01em' }}>{money(total)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
