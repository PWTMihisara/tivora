'use client';

import { useStore } from '@/store/useStore';

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(10,10,10,0.3)',
  padding: '14px 16px',
  font: "400 14px 'Inter',sans-serif",
  outline: 'none',
  background: 'transparent',
};

export default function CheckoutView() {
  const checkoutForm          = useStore(s => s.checkoutForm);
  const setCheckoutField      = useStore(s => s.setCheckoutField);
  const fillCheckoutFromProfile = useStore(s => s.fillCheckoutFromProfile);
  const cartLines             = useStore(s => s.cartLines);
  const subtotalLabel         = useStore(s => s.subtotalLabel);
  const placeOrder            = useStore(s => s.placeOrder);
  const user                  = useStore(s => s.user);

  const lines = cartLines();
  const hasSavedAddress = !!(user?.address || user?.city);

  return (
    <main className="checkout-layout" style={{ padding: '56px 48px 96px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ font: "800 28px 'Archivo',sans-serif", margin: '0 0 40px', letterSpacing: '-0.01em' }}>CHECKOUT</h1>

      <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 64 }}>
        {/* Form */}
        <div>
          {/* Autofill banner */}
          {user && hasSavedAddress && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f5f3f0', padding: '14px 18px', marginBottom: 28 }}>
              <div>
                <div style={{ font: "600 13px 'Inter',sans-serif" }}>
                  {user.name}
                  {(user as { addressName?: string }).addressName && (
                    <span style={{ marginLeft: 8, font: "500 11px 'Inter',sans-serif", color: '#6b6b6b', background: '#e7e5e0', padding: '2px 8px' }}>
                      {(user as { addressName?: string }).addressName}
                    </span>
                  )}
                </div>
                <div style={{ font: "400 12px 'Inter',sans-serif", color: '#6b6b6b', marginTop: 2 }}>{[user.address, user.city, user.zip].filter(Boolean).join(', ')}</div>
              </div>
              <button
                onClick={fillCheckoutFromProfile}
                style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '10px 18px', font: "700 11px/1 'Inter',sans-serif", letterSpacing: '0.1em', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >USE THIS ADDRESS</button>
            </div>
          )}

          <div style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>CONTACT</div>
          <input
            placeholder="Email address"
            value={checkoutForm.email}
            onChange={e => setCheckoutField('email', e.target.value)}
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
