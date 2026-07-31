'use client';

import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { PRODUCTS, money } from '@/data/products';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ open, onClose }: Props) {
  const wishlist       = useStore(s => s.wishlist);
  const toggleWishlist = useStore(s => s.toggleWishlist);
  const selectProduct  = useStore(s => s.selectProduct);
  const productImages  = useSharedStore(s => s.productImages);

  if (!open) return null;

  const wishedProducts = PRODUCTS.filter(p => !!wishlist[p.id]);

  const handleGoProduct = (id: string) => {
    selectProduct(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: 'rgba(10,10,10,0.5)' }}
        onClick={onClose}
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
            WISHLIST ({wishedProducts.length})
          </div>
          <button onClick={onClose} className="bg-transparent border-none text-xl cursor-pointer">×</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '20px 28px' }}>
          {wishedProducts.length === 0 ? (
            <div className="text-center py-16" style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b' }}>
              Your wishlist is empty.
            </div>
          ) : (
            wishedProducts.map(p => (
              <div
                key={p.id}
                className="flex gap-4 py-4"
                style={{ borderBottom: '1px solid rgba(10,10,10,0.08)' }}
              >
                {/* Thumbnail */}
                <button
                  onClick={() => handleGoProduct(p.id)}
                  className="flex-none border-none cursor-pointer p-0"
                  style={{
                    width: 72, height: 88, position: 'relative', overflow: 'hidden',
                    background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 8px,#dcd9d2 8px,#dcd9d2 16px)',
                  }}
                >
                  {productImages[p.id]?.[0] && (
                    <img
                      src={productImages[p.id][0]}
                      alt={p.name}
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </button>

                <div className="flex-1">
                  <div
                    style={{ font: "600 11px 'Inter',sans-serif", letterSpacing: '0.08em', color: '#6b6b6b', marginBottom: 4 }}
                  >
                    {p.category.toUpperCase()} · {p.gender === 'men' ? 'MEN' : 'WOMEN'}
                  </div>
                  <button
                    onClick={() => handleGoProduct(p.id)}
                    className="text-left bg-transparent border-none cursor-pointer p-0"
                    style={{ font: "600 14px 'Inter',sans-serif", marginBottom: 4, display: 'block' }}
                  >
                    {p.name}
                  </button>
                  <div style={{ font: "500 13px 'Inter',sans-serif", color: '#0a0a0a', marginBottom: 10 }}>
                    {money(p.price)}
                  </div>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="bg-transparent border-none cursor-pointer underline p-0"
                    style={{ font: "400 11px 'Inter',sans-serif", color: '#6b6b6b', letterSpacing: '0.05em' }}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
