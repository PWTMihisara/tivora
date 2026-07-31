'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';

interface Collection {
  id: string;
  name: string;
  active: boolean;
  banner_url: string | null;
  product_count: number;
}

const HATCH = 'repeating-linear-gradient(45deg,#f0ede8 0,#f0ede8 1px,#f8f7f5 0,#f8f7f5 50%) 0 0/8px 8px';

export default function CollectionsView() {
  const goPLPAll          = useStore(s => s.goPLPAll);
  const collectionBanners = useSharedStore(s => s.collectionBanners);

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then(r => r.json())
      .then((data: Collection[]) => {
        if (Array.isArray(data)) setCollections(data.filter(c => c.active));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ minHeight: '70vh', background: '#fdfdfc', paddingBottom: 80 }}>

      {/* Page header */}
      <div style={{
        borderBottom: '1px solid rgba(10,10,10,0.1)',
        padding: '56px 48px 40px',
        background: '#fdfdfc',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ font: "500 11px/1 'Inter',sans-serif", letterSpacing: '0.18em', color: '#9a9a96', marginBottom: 12 }}>
            TIVORA
          </p>
          <h1 style={{ font: "800 48px/1 'Archivo',sans-serif", color: '#0a0a0a', margin: 0 }}>
            Collections
          </h1>
          <p style={{ font: "400 15px/1.6 'Inter',sans-serif", color: '#6b6b6b', marginTop: 14, maxWidth: 480 }}>
            Explore our curated edits, each telling a distinct story through fabric, form, and craft.
          </p>
        </div>
      </div>

      {/* Collections grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 48px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
            <div style={{ width: 28, height: 28, border: '2px solid #e7e5e0', borderTopColor: '#0a0a0a', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          </div>
        ) : collections.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: '#9a9a96', font: "400 15px/1 'Inter',sans-serif" }}>
            No collections available.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
          className="collections-grid"
          >
            {collections.map((c, i) => {
              const banner = collectionBanners[c.name] || c.banner_url;
              const isWide = i === 0; // first card is wide
              return (
                <div
                  key={c.id}
                  style={{
                    gridColumn: isWide ? 'span 2' : 'span 1',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #e7e5e0',
                    background: '#fff',
                    cursor: 'pointer',
                    position: 'relative',
                  }}
                  className="collection-card"
                  onClick={goPLPAll}
                >
                  {/* Banner image */}
                  <div style={{
                    height: isWide ? 420 : 280,
                    position: 'relative',
                    background: banner ? 'transparent' : HATCH,
                    overflow: 'hidden',
                  }}>
                    {banner ? (
                      <img
                        src={banner}
                        alt={c.name}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        className="collection-card-img"
                      />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.14em', color: '#c0bdb8' }}>NO BANNER</span>
                      </div>
                    )}

                    {/* Dark gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.1) 50%, transparent 100%)',
                    }} />

                    {/* Text over image */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 28px' }}>
                      <p style={{ font: "500 11px/1 'Inter',sans-serif", letterSpacing: '0.16em', color: 'rgba(255,255,255,0.7)', margin: '0 0 8px' }}>
                        {c.product_count} PIECES
                      </p>
                      <h2 style={{ font: `${isWide ? 700 : 600} ${isWide ? 28 : 20}px/1.1 'Archivo',sans-serif`, color: '#fff', margin: '0 0 16px' }}>
                        {c.name}
                      </h2>
                      <button
                        onClick={e => { e.stopPropagation(); goPLPAll(); }}
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: '1px solid rgba(255,255,255,0.5)',
                          color: '#fff',
                          padding: '8px 20px',
                          borderRadius: 6,
                          font: "600 11px/1 'Inter',sans-serif",
                          letterSpacing: '0.12em',
                          cursor: 'pointer',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        EXPLORE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
