'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Address } from '@/components/account/AccountView';

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(10,10,10,0.3)',
  padding: '14px 16px',
  font: "400 14px 'Inter',sans-serif",
  outline: 'none',
  background: 'transparent',
};

export default function CheckoutView() {
  const checkoutForm     = useStore(s => s.checkoutForm);
  const setCheckoutField = useStore(s => s.setCheckoutField);
  const cartLines        = useStore(s => s.cartLines);
  const subtotalLabel    = useStore(s => s.subtotalLabel);
  const placeOrder       = useStore(s => s.placeOrder);
  const user             = useStore(s => s.user);

  const [addresses, setAddresses]   = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/account/addresses?user_id=${user.id}`)
      .then(r => r.json())
      .then((data: Address[]) => {
        if (Array.isArray(data)) {
          setAddresses(data);
          const def = data.find(a => a.is_default) ?? data[0];
          if (def) applyAddress(def, data);
        }
      }).catch(console.error);
  }, [user?.id]);

  const applyAddress = (addr: Address, list?: Address[]) => {
    setSelectedId(addr.id);
    const s = useStore.getState().setCheckoutField;
    s('name',    addr.name    || user?.name  || '');
    s('email',   user?.email  || '');
    s('phone',   addr.phone   || '');
    s('address', addr.address || '');
    s('city',    addr.city    || '');
    s('zip',     addr.zip     || '');
    void list;
  };

  const lines = cartLines();

  return (
    <main className="checkout-layout" style={{ padding: '56px 48px 96px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ font: "800 28px 'Archivo',sans-serif", margin: '0 0 40px', letterSpacing: '-0.01em' }}>CHECKOUT</h1>

      <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 64 }}>
        {/* Form */}
        <div>
          {/* Saved addresses picker */}
          {user && addresses.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 12 }}>SAVED ADDRESSES</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {addresses.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => applyAddress(addr)}
                    style={{
                      textAlign: 'left', cursor: 'pointer', padding: '14px 18px',
                      border: `1.5px solid ${selectedId === addr.id ? '#0a0a0a' : 'rgba(10,10,10,0.15)'}`,
                      background: selectedId === addr.id ? '#f5f3f0' : '#fff',
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${selectedId === addr.id ? '#0a0a0a' : 'rgba(10,10,10,0.3)'}`, background: selectedId === addr.id ? '#0a0a0a' : 'none', flexShrink: 0 }} />
                    <div>
                      <div style={{ font: "600 13px/1 'Inter',sans-serif", marginBottom: 3 }}>
                        {addr.name}
                        {addr.label && <span style={{ marginLeft: 8, font: "500 11px/1 'Inter',sans-serif", color: '#6b6b6b', background: '#e7e5e0', padding: '2px 7px' }}>{addr.label}</span>}
                        {addr.is_default && <span style={{ marginLeft: 6, font: "600 10px/1 'Inter',sans-serif", color: '#2F6B45' }}>DEFAULT</span>}
                      </div>
                      <div style={{ font: "400 12px/1 'Inter',sans-serif", color: '#6b6b6b' }}>{[addr.address, addr.city, addr.zip].filter(Boolean).join(', ')}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ font: "500 12px 'Inter',sans-serif", color: '#9a9a96', marginTop: 10 }}>Or fill in a different address below</div>
            </div>
          )}

          <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>CONTACT</div>
          <input
            placeholder="Email address"
            value={checkoutForm.email}
            onChange={e => setCheckoutField('email', e.target.value)}
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          <input
            placeholder="Phone number"
            value={checkoutForm.phone}
            onChange={e => setCheckoutField('phone', e.target.value)}
            style={{ ...inputStyle, marginBottom: 32 }}
          />

          <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>SHIPPING ADDRESS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
            <input
              placeholder="Full name"
              value={checkoutForm.name}
              onChange={e => setCheckoutField('name', e.target.value)}
              style={{ ...inputStyle, gridColumn: '1/3' }}
            />
            <input
              placeholder="Address"
              value={checkoutForm.address}
              onChange={e => setCheckoutField('address', e.target.value)}
              style={{ ...inputStyle, gridColumn: '1/3' }}
            />
            <input
              placeholder="City"
              value={checkoutForm.city}
              onChange={e => setCheckoutField('city', e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="ZIP"
              value={checkoutForm.zip}
              onChange={e => setCheckoutField('zip', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>PAYMENT</div>
          <div style={{ border: '1px solid rgba(10,10,10,0.3)', padding: '14px 16px', font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>
            Card number
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div style={{ border: '1px solid rgba(10,10,10,0.12)', padding: 28 }}>
            <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 20 }}>ORDER SUMMARY</div>
            {lines.map(c => (
              <div key={`${c.id}-${c.size}`} className="flex justify-between mb-3" style={{ font: "400 13px 'Inter',sans-serif" }}>
                <span>{c.name} ({c.size}) ×{c.qty}</span>
                <span>{c.lineTotalLabel}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(10,10,10,0.12)', margin: '16px 0' }} />
            <div className="flex justify-between mb-2" style={{ font: "400 13px 'Inter',sans-serif" }}>
              <span>Subtotal</span><span>{subtotalLabel()}</span>
            </div>
            <div className="flex justify-between mb-4" style={{ font: "400 13px 'Inter',sans-serif" }}>
              <span>Shipping</span><span>Complimentary</span>
            </div>
            <div className="flex justify-between mb-6" style={{ font: "700 15px 'Inter',sans-serif" }}>
              <span>Total</span><span>{subtotalLabel()}</span>
            </div>
            <button
              onClick={placeOrder}
              className="w-full cursor-pointer"
              style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: 16, font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em' }}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
