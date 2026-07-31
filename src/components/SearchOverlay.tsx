'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { PRODUCTS } from '@/data/products';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery]   = useState('');
  const inputRef            = useRef<HTMLInputElement>(null);
  const selectProduct       = useStore(s => s.selectProduct);
  const goSearch            = useStore(s => s.goSearch);
  const productImages       = useSharedStore(s => s.productImages);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const q = query.toLowerCase().trim();
  const results = q
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q)
      ).slice(0, 6)
    : [];

  const handleSelect = (id: string) => {
    selectProduct(id);
    onClose();
  };

  const handleViewAll = () => {
    goSearch(query);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q) { goSearch(query); onClose(); }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.4)', zIndex: 50, backdropFilter: 'blur(2px)' }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 51,
        background: '#fdfdfc', borderBottom: '1px solid rgba(10,10,10,0.1)',
        padding: '0 48px 24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      }}>
        {/* Search input row */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', height: 88, gap: 16 }}>
          <span style={{ fontSize: 18, color: '#6b6b6b', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search products…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              font: "500 20px 'Archivo',sans-serif", color: '#0a0a0a', letterSpacing: '-0.01em',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', font: "500 13px 'Inter',sans-serif", color: '#6b6b6b', letterSpacing: '0.08em', flexShrink: 0 }}
          >
            CLOSE
          </button>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div style={{ maxWidth: 680 }}>
            <div style={{ font: "600 11px 'Inter',sans-serif", letterSpacing: '0.14em', color: '#9a9a96', marginBottom: 12 }}>
              RESULTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {results.map(p => {
                const img = productImages[p.id]?.[0] || p.images?.[0];
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '10px 12px',
                      background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
                      textAlign: 'left', width: '100%',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f7f5f2'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
                  >
                    <div style={{
                      width: 48, height: 56, borderRadius: 6, flexShrink: 0, overflow: 'hidden',
                      background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 4px,#dcd9d2 4px,#dcd9d2 8px)',
                    }}>
                      {img && <img src={img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ font: "600 14px 'Inter',sans-serif", color: '#0a0a0a' }}>{p.name}</div>
                      <div style={{ font: "400 12px 'Inter',sans-serif", color: '#9a9a96', marginTop: 2 }}>
                        {p.category} · {p.gender === 'men' ? 'Men' : 'Women'}
                      </div>
                    </div>
                    <div style={{ font: "600 14px 'Inter',sans-serif", color: '#0a0a0a', flexShrink: 0 }}>
                      Rs. {p.price.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>

            {results.length >= 1 && (
              <button
                onClick={handleViewAll}
                style={{
                  marginTop: 12, padding: '10px 20px', background: '#0a0a0a', color: '#fff',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  font: "600 12px 'Inter',sans-serif", letterSpacing: '0.1em',
                }}
              >
                VIEW ALL RESULTS FOR "{query.toUpperCase()}"
              </button>
            )}
          </div>
        )}

        {q && results.length === 0 && (
          <div style={{ font: "400 14px 'Inter',sans-serif", color: '#9a9a96', paddingBottom: 8 }}>
            No products found for "{query}"
          </div>
        )}
      </div>
    </>
  );
}
