'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { Product } from '@/types';

interface Props {
  product: Product & { priceLabel: string; categoryLabel: string };
  onSelect: (p: Product) => void;
  onQuickAdd: (p: Product) => void;
}

export default function ProductCard({ product, onSelect, onQuickAdd }: Props) {
  const toggleWishlist = useStore(s => s.toggleWishlist);
  const storeWished    = useStore(s => !!s.wishlist[product.id]);
  const savedImages    = useSharedStore(s => s.productImages[product.id]);
  const images         = savedImages?.length ? savedImages : product.images;

  // Local state gives instant visual feedback independent of store re-render timing
  const [wished, setWished] = useState(storeWished);

  // Keep in sync if store changes externally (e.g. from another component)
  useEffect(() => {
    setWished(storeWished);
  }, [storeWished]);

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const next = !wished;
    setWished(next);
    toggleWishlist(product.id);
  };

  return (
    <div
      className="product-card relative flex flex-col cursor-pointer"
      onClick={() => onSelect(product)}
    >
      {/* Image area */}
      <div
        className="relative mb-[14px]"
        style={{
          aspectRatio: '4/5',
          background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 12px,#dcd9d2 12px,#dcd9d2 24px)',
          overflow: 'hidden', willChange: 'transform',
        }}
      >
        {/* Product image */}
        {images?.[0] ? (
          <img
            src={images[0]}
            alt={product.name}
            className="card-img"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
          />
        ) : (
          <span
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              font: "600 10px 'Inter',monospace", letterSpacing: '0.12em',
              color: '#8a8a86', textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            Product Shot
          </span>
        )}

        {/* Wishlist heart — positioned absolutely, z-index above everything */}
        <button
          type="button"
          onClick={handleWishlist}
          style={{
            position: 'absolute', top: 12, right: 12,
            width: 34, height: 34,
            background: 'rgba(253,253,252,0.92)',
            border: 'none', cursor: 'pointer',
            fontSize: 16, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 20,
          }}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wished ? '♥' : '♡'}
        </button>

        {/* Quick Add */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); e.preventDefault(); onQuickAdd(product); }}
          className="quick-add-btn"
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            background: '#0a0a0a', color: '#fff', border: 'none',
            padding: '12px 0', cursor: 'pointer',
            font: "700 11px 'Inter',sans-serif", letterSpacing: '0.1em',
            opacity: 0, transition: 'opacity 0.2s ease',
            zIndex: 20,
          }}
        >
          QUICK ADD
        </button>
      </div>

      <div style={{ font: "600 11px 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b', marginBottom: 6 }}>
        {product.categoryLabel}
      </div>
      <div style={{ font: "600 14px 'Inter',sans-serif", marginBottom: 6 }}>
        {product.name}
      </div>
      <div style={{ font: "500 13px 'Inter',sans-serif", color: '#0a0a0a' }}>
        {product.priceLabel}
      </div>
    </div>
  );
}
