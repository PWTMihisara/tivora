'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { CATEGORIES, SIZES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { SortBy } from '@/types';

const revealStyle: React.CSSProperties = {
  opacity: 0,
  transform: 'translateY(24px)',
  transition: 'opacity 0.7s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
};

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('[data-plp-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });
}

export default function PLPView() {
  useReveal();
  const filteredProducts = useStore(s => s.filteredProducts);
  const filterGender     = useStore(s => s.filterGender);
  const filterCategory   = useStore(s => s.filterCategory);
  const setGender        = useStore(s => s.setGender);
  const setCategory      = useStore(s => s.setCategory);
  const clearFilters     = useStore(s => s.clearFilters);
  const sortBy           = useStore(s => s.sortBy);
  const setSortBy        = useStore(s => s.setSortBy);
  const searchQuery      = useStore(s => s.searchQuery);
  const selectProduct    = useStore(s => s.selectProduct);
  const quickAdd         = useStore(s => s.quickAdd);

  const products = filteredProducts();
  const genderLabel = searchQuery ? `RESULTS FOR "${searchQuery.toUpperCase()}"` : filterGender === 'men' ? 'MEN' : filterGender === 'women' ? 'WOMEN' : 'ALL PRODUCTS';
  const countLabel = products.length + (products.length === 1 ? ' PIECE' : ' PIECES');

  const genderBase: React.CSSProperties = {
    textAlign: 'left', background: 'none', border: 'none', padding: 0,
    cursor: 'pointer', font: "500 13px 'Inter',sans-serif",
  };

  const genderBtn = (active: boolean): React.CSSProperties => ({
    ...genderBase,
    color: active ? '#0a0a0a' : '#6b6b6b',
    fontWeight: active ? 700 : 500,
  });

  return (
    <main className="plp-layout" style={{ padding: '48px 48px 96px', maxWidth: 1440, margin: '0 auto' }}>
      {/* Title row */}
      <div className="flex justify-between items-baseline mb-2">
        <h1 style={{ font: "800 30px 'Archivo',sans-serif", margin: 0, letterSpacing: '-0.01em' }}>{genderLabel}</h1>
        <div style={{ font: "500 12px 'Inter',sans-serif", color: '#6b6b6b', letterSpacing: '0.05em' }}>{countLabel}</div>
      </div>
      <div style={{ height: 1, background: 'rgba(10,10,10,0.12)', margin: '24px 0 40px' }} />

      <div className="plp-content-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>
        {/* Sidebar */}
        <aside className="plp-sidebar">
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.14em', color: '#0a0a0a', marginBottom: 16 }}>GENDER</div>
          <div className="flex flex-col gap-[10px] mb-8">
            {(['all', 'men', 'women'] as const).map(g => (
              <button key={g} style={genderBtn(filterGender === g)} onClick={() => setGender(g)}>
                {g === 'all' ? 'All' : g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.14em', color: '#0a0a0a', marginBottom: 16 }}>CATEGORY</div>
          <div className="flex flex-col gap-[10px] mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat} style={genderBtn(filterCategory === cat)} onClick={() => setCategory(cat)}>
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={clearFilters}
            className="bg-transparent border-none p-0 cursor-pointer underline"
            style={{ font: "600 11px 'Inter',sans-serif", letterSpacing: '0.1em', color: '#6b6b6b' }}
          >
            CLEAR FILTERS
          </button>
        </aside>

        {/* Grid */}
        <div>
          {/* Sort */}
          <div className="flex justify-end mb-6">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortBy)}
              style={{
                border: '1px solid rgba(10,10,10,0.3)', background: '#fdfdfc',
                padding: '10px 14px', font: "500 12px 'Inter',sans-serif", letterSpacing: '0.05em',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Sort: Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
            </select>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center" style={{ font: "500 14px 'Inter',sans-serif", color: '#6b6b6b' }}>
              No pieces match these filters.
            </div>
          ) : (
            <div className="plp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 28 }}>
              {products.map((p, i) => (
                <div key={p.id} data-plp-reveal="" style={{ ...revealStyle, transitionDelay: `${(i % 3) * 80}ms` }}>
                  <ProductCard
                    product={p}
                    onSelect={p => selectProduct(p.id)}
                    onQuickAdd={p => quickAdd(p.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
