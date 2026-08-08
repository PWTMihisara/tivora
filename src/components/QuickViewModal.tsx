'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { Product, Size } from '@/types';
import { SIZES, money } from '@/data/products';

interface Props {
  product: Product & { priceLabel: string; categoryLabel: string };
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: Props) {
  const addToCart     = useStore(s => s.addToCart);
  const selectProduct = useStore(s => s.selectProduct);
  const savedImages   = useSharedStore(s => s.productImages[product.id]);
  const stockBySize   = useSharedStore(s => s.inventory[product.id] ?? {});
  const overrides     = useSharedStore(s => s.productOverrides[product.id]);
  const images        = savedImages?.length ? savedImages : product.images;

  const name  = overrides?.name  ?? product.name;
  const price = overrides?.price ?? product.price;

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [sizeError, setSizeError]       = useState(false);
  const [added, setAdded]               = useState(false);

  const hasInventory = Object.keys(stockBySize).length > 0;
  const isSizeOos = (sz: Size) => hasInventory && (stockBySize[sz] ?? 0) === 0;
  const selectedOos = selectedSize ? isSizeOos(selectedSize) : false;

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); return; }
    if (selectedOos) return;
    addToCart(product.id, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 80,
        background: 'rgba(10,10,10,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'viewFadeIn 0.2s ease both',
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="quickview-inner"
        style={{
          background: '#fff', maxWidth: 720, width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          animation: 'viewFadeIn 0.25s ease both',
        }}
      >
        {/* Image */}
        <div style={{
          aspectRatio: '4/5', position: 'relative', overflow: 'hidden',
          background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 12px,#dcd9d2 12px,#dcd9d2 24px)',
        }}>
          {images?.[0] ? (
            <img src={images[0]} alt={name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 10px 'Inter',monospace", color: '#8a8a86', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              Product Shot
            </span>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: '#9a9a96', lineHeight: 1 }}>x</button>

          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.12em', color: '#6b6b6b', marginBottom: 10 }}>
            {product.categoryLabel}
          </div>
          <div style={{ font: "800 24px/1.15 'Archivo',sans-serif", letterSpacing: '-0.01em', marginBottom: 10 }}>
            {name}
          </div>
          <div style={{ font: "600 18px 'Inter',sans-serif", marginBottom: 20 }}>
            {money(price)}
          </div>
          <p style={{ font: "400 13px/1.6 'Inter',sans-serif", color: '#4a4a48', margin: '0 0 24px' }}>
            A considered piece cut from premium materials, finished by hand for a silhouette built to outlast the season.
          </p>

          {/* Sizes */}
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.14em', marginBottom: 10 }}>SIZE</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            {SIZES.map(sz => {
              const oos = isSizeOos(sz);
              return (
                <button
                  key={sz}
                  onClick={() => { if (!oos) { setSelectedSize(sz); setSizeError(false); } }}
                  disabled={oos}
                  style={{
                    width: 42, height: 38, cursor: oos ? 'not-allowed' : 'pointer',
                    border: `1px solid ${selectedSize === sz ? '#0a0a0a' : 'rgba(10,10,10,0.25)'}`,
                    background: oos ? '#f5f5f3' : selectedSize === sz ? '#0a0a0a' : 'none',
                    color: oos ? '#c0bdb8' : selectedSize === sz ? '#fff' : '#0a0a0a',
                    font: "500 11px 'Inter',sans-serif", borderRadius: 4,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {sz}
                  {oos && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ position: 'absolute', width: '140%', height: 1, background: '#c0bdb8', transform: 'rotate(-45deg)' }} /></span>}
                </button>
              );
            })}
          </div>
          {sizeError && <div style={{ font: "500 11px 'Inter',sans-serif", color: '#b02a2a', marginBottom: 8 }}>Please select a size.</div>}
          {selectedOos && <div style={{ font: "500 11px 'Inter',sans-serif", color: '#b02a2a', marginBottom: 8 }}>This size is out of stock.</div>}

          <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
            <button
              onClick={handleAdd}
              disabled={selectedOos}
              style={{
                flex: 1, background: selectedOos ? '#c0bdb8' : '#0a0a0a', color: '#fff',
                border: 'none', padding: '14px 0', borderRadius: 6,
                font: "700 11px/1 'Inter',sans-serif", letterSpacing: '0.1em',
                cursor: selectedOos ? 'not-allowed' : 'pointer',
              }}
            >
              {selectedOos ? 'OUT OF STOCK' : added ? 'ADDED ✓' : 'ADD TO BAG'}
            </button>
            <button
              onClick={() => { onClose(); selectProduct(product.id); }}
              style={{
                background: 'none', border: '1px solid rgba(10,10,10,0.2)', padding: '14px 18px',
                borderRadius: 6, font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.06em',
                cursor: 'pointer', color: '#0a0a0a',
              }}
            >
              VIEW DETAILS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
