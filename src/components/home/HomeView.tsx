'use client';

import { useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import ProductCard from '@/components/ProductCard';

function useReveal() {
  const revealedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => {
      const htmlEl = el as HTMLElement;
      if (!revealedRef.current.has(htmlEl.dataset.reveal!)) {
        observer.observe(htmlEl);
      }
    });

    return () => observer.disconnect();
  });
}

const revealStyle: React.CSSProperties = {
  opacity: 0,
  transform: 'translateY(28px)',
  transition: 'opacity .8s ease, transform .8s ease',
};

export default function HomeView() {
  useReveal();

  const goPLPAll       = useStore(s => s.goPLPAll);
  const goPLPMen       = useStore(s => s.goPLPMen);
  const goPLPWomen     = useStore(s => s.goPLPWomen);
  const selectProduct  = useStore(s => s.selectProduct);
  const quickAdd       = useStore(s => s.quickAdd);
  const featuredProducts = useStore(s => s.featuredProducts);

  const featured = featuredProducts();
  const collectionBanners = useSharedStore(s => s.collectionBanners);

  return (
    <main>
      {/* DARK CINEMATIC HERO */}
      <section
        style={{ background: '#0a0a0a', color: '#fff', minHeight: 'calc(100vh - 88px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}
      >
        <div style={{ width: 56, height: 56, background: '#fff', transform: 'rotate(45deg)', marginBottom: 36 }} />
        <div style={{ font: "600 12px/1 'Inter',sans-serif", letterSpacing: '0.25em', color: '#9a9a96', marginBottom: 18 }}>TIVORA · CLOTHING</div>
        <h1 style={{ font: "800 48px/1.1 'Archivo',sans-serif", letterSpacing: '-0.01em', margin: '0 0 20px', maxWidth: 640 }}>
          Quiet luxury,<br />deliberately built.
        </h1>
        <p style={{ font: "400 16px/1.6 'Inter',sans-serif", color: '#c9c9c6', maxWidth: 420, margin: '0 0 36px' }}>
          A wardrobe of essentials designed to outlast trend cycles entirely.
        </p>
        <button
          onClick={goPLPAll}
          style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '16px 32px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer' }}
        >
          ENTER THE COLLECTION
        </button>
        <div
          className="animate-bounce-down absolute bottom-7"
          style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.5)' }}
        />
      </section>

      <section
        data-reveal="v3mid"
        className="v3-mid-grid"
        style={{ ...revealStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
      >
        <div className="flex flex-col justify-center" style={{ padding: '64px 64px', background: '#fdfdfc' }}>
          <h2 style={{ font: "800 30px/1.2 'Archivo',sans-serif", margin: '0 0 18px', letterSpacing: '-0.01em' }}>Two collections.<br />One standard.</h2>
          <p style={{ font: "400 15px/1.6 'Inter',sans-serif", color: '#4a4a48', margin: '0 0 28px' }}>
            Menswear and womenswear cut from the same discipline — restrained palettes, exacting tailoring.
          </p>
          <div className="flex gap-4">
            <button onClick={goPLPMen} className="bg-transparent cursor-pointer" style={{ font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', border: 'none', borderBottom: '1px solid #0a0a0a', paddingBottom: 4 }}>MEN →</button>
            <button onClick={goPLPWomen} className="bg-transparent cursor-pointer" style={{ font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', border: 'none', borderBottom: '1px solid #0a0a0a', paddingBottom: 4 }}>WOMEN →</button>
          </div>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ background: 'repeating-linear-gradient(135deg,#111,#111 12px,#1c1c1c 12px,#1c1c1c 24px)', minHeight: 320, position: 'relative', overflow: 'hidden' }}
        >
          {collectionBanners['Autumn Tailoring'] ? (
            <img
              src={collectionBanners['Autumn Tailoring']}
              alt="Collection"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ font: "600 11px 'Inter',monospace", letterSpacing: '0.15em', color: '#8a8a86', textTransform: 'uppercase' }}>Editorial Image</span>
          )}
        </div>
      </section>

      {/* SHARED: FEATURED GRID */}
      <section data-reveal="featured" className="featured-grid-section" style={{ ...revealStyle, padding: '96px 48px' }}>
        <div className="flex justify-between items-baseline mb-10">
          <h2 style={{ font: "800 28px 'Archivo',sans-serif", margin: 0, letterSpacing: '-0.01em' }}>NEW ARRIVALS</h2>
          <button
            onClick={goPLPAll}
            className="bg-transparent border-none cursor-pointer"
            style={{ font: "600 12px 'Inter',sans-serif", letterSpacing: '0.1em', borderBottom: '1px solid #0a0a0a', paddingBottom: 3 }}
          >
            VIEW ALL
          </button>
        </div>
        <div className="featured-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
          {featured.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={p => selectProduct(p.id)}
              onQuickAdd={p => quickAdd(p.id)}
            />
          ))}
        </div>
      </section>

      {/* SHARED: CTA BAND */}
      <section
        data-reveal="ctaband"
        className="cta-band"
        style={{ ...revealStyle, background: '#0a0a0a', color: '#fff', padding: '88px 48px', textAlign: 'center' }}
      >
        <h2 style={{ font: "800 32px/1.2 'Archivo',sans-serif", margin: '0 0 28px', letterSpacing: '-0.01em' }}>DEFINED BY DETAIL</h2>
        <button
          onClick={goPLPAll}
          style={{ background: '#fff', color: '#0a0a0a', border: 'none', padding: '16px 32px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer' }}
        >
          EXPLORE THE COLLECTION
        </button>
      </section>
    </main>
  );
}
