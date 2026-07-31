'use client';

import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';

export default function CartDrawer() {
  const productImages = useSharedStore(s => s.productImages);
  const cartOpen      = useStore(s => s.cartOpen);
  const closeCart     = useStore(s => s.closeCart);
  const incLine       = useStore(s => s.incLine);
  const decLine       = useStore(s => s.decLine);
  const removeLine    = useStore(s => s.removeLine);
  const goCheckout    = useStore(s => s.goCheckout);

  // Subscribe to cart directly so component re-renders when cart changes
  const cart          = useStore(s => s.cart);
  const cartLinesF    = useStore(s => s.cartLines);
  const cartCountF    = useStore(s => s.cartCount);
  const cartEmptyF    = useStore(s => s.cartEmpty);
  const subtotalLabelF = useStore(s => s.subtotalLabel);

  if (!cartOpen) return null;

  const lines         = cartLinesF();
  const cartCount     = cartCountF();
  const isEmpty       = cartEmptyF();
  const subtotalLabel = subtotalLabelF();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(10,10,10,0.5)' }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className="cart-drawer fixed top-0 right-0 bottom-0 z-[51] flex flex-col"
        style={{ width: 420, background: '#fdfdfc', boxShadow: '-8px 0 32px rgba(0,0,0,0.2)' }}
      >
        {/* Header */}
        <div
          className="flex justify-between items-center"
          style={{ padding: '28px 28px 20px', borderBottom: '1px solid rgba(10,10,10,0.12)' }}
        >
          <div style={{ font: "800 16px 'Archivo',sans-serif", letterSpacing: '-0.01em' }}>
            YOUR BAG ({cartCount})
          </div>
          <button onClick={closeCart} className="bg-transparent border-none text-xl cursor-pointer">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 28px' }}>
          {isEmpty ? (
            <div className="text-center py-16" style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>
              Your bag is empty.
            </div>
          ) : (
            lines.map(c => (
              <div
                key={`${c.id}-${c.size}`}
                className="flex gap-4 py-4"
                style={{ borderBottom: '1px solid rgba(10,10,10,0.08)' }}
              >
                <div
                  className="flex-none"
                  style={{
                    width: 72, height: 88, position: 'relative', overflow: 'hidden',
                    background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 8px,#dcd9d2 8px,#dcd9d2 16px)',
                  }}
                >
                  {productImages[c.id]?.[0] && (
                    <img
                      src={productImages[c.id][0]}
                      alt={c.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div style={{ font: "600 13px 'Inter',sans-serif", marginBottom: 4 }}>{c.name}</div>
                  <div style={{ font: "400 12px 'Inter',sans-serif", color: '#6b6b6b', marginBottom: 10 }}>
                    Size {c.size} · {c.priceLabel}
                  </div>
                  <div className="flex items-center gap-[10px]">
                    <button
                      onClick={() => decLine(c.id, c.size)}
                      style={{ width: 22, height: 22, border: '1px solid rgba(10,10,10,0.3)', background: 'none', cursor: 'pointer', font: "400 12px sans-serif" }}
                    >−</button>
                    <span style={{ font: "500 12px 'Inter',sans-serif" }}>{c.qty}</span>
                    <button
                      onClick={() => incLine(c.id, c.size)}
                      style={{ width: 22, height: 22, border: '1px solid rgba(10,10,10,0.3)', background: 'none', cursor: 'pointer', font: "400 12px sans-serif" }}
                    >+</button>
                    <button
                      onClick={() => removeLine(c.id, c.size)}
                      className="ml-auto bg-transparent border-none cursor-pointer underline"
                      style={{ font: "400 11px 'Inter',sans-serif", color: '#6b6b6b', letterSpacing: '0.05em' }}
                    >REMOVE</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 28px 32px', borderTop: '1px solid rgba(10,10,10,0.12)' }}>
          <div className="flex justify-between mb-5" style={{ font: "700 14px 'Inter',sans-serif" }}>
            <span>Subtotal</span>
            <span>{subtotalLabel}</span>
          </div>
          <button
            onClick={goCheckout}
            className="w-full cursor-pointer"
            style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: 16, font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em' }}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
}
