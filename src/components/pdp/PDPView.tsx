'use client';

import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { SIZES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/pdp/ReviewsSection';
import { Size } from '@/types';

export default function PDPView() {
  const selectedProduct    = useStore(s => s.selectedProduct);
  const relatedProducts    = useStore(s => s.relatedProducts);
  const activeImage        = useStore(s => s.activeImage);
  const setActiveImage     = useStore(s => s.setActiveImage);
  const selectedSize       = useStore(s => s.selectedSize);
  const selectSize         = useStore(s => s.selectSize);
  const sizeError          = useStore(s => s.sizeError);
  const addSelectedToCart  = useStore(s => s.addSelectedToCart);
  const selectedProductId  = useStore(s => s.selectedProductId);
  const wished             = useStore(s => !!s.wishlist[s.selectedProductId ?? '']);
  const toggleWishlist     = useStore(s => s.toggleWishlist);
  const selectProduct      = useStore(s => s.selectProduct);
  const quickAdd           = useStore(s => s.quickAdd);
  const materialsOpen      = useStore(s => s.materialsOpen);
  const shippingOpen       = useStore(s => s.shippingOpen);
  const toggleMaterials    = useStore(s => s.toggleMaterials);
  const toggleShipping     = useStore(s => s.toggleShipping);

  const [added, setAdded]             = useState(false);
  const [lightbox, setLightbox]       = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Lock body scroll when size guide is open
  useEffect(() => {
    if (sizeGuideOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sizeGuideOpen]);

  const product = selectedProduct();
  const related = relatedProducts();
  const savedImages  = useSharedStore(s => s.productImages[product?.id ?? '']);
  const stockBySize  = useSharedStore(s => s.inventory[product?.id ?? ''] ?? {});
  const images = savedImages?.length ? savedImages : product?.images;

  const isSizeOutOfStock = (sz: Size) => {
    if (Object.keys(stockBySize).length === 0) return false; // no inventory data = assume available
    return (stockBySize[sz] ?? 0) === 0;
  };
  const selectedSizeOos = selectedSize ? isSizeOutOfStock(selectedSize) : false;

  const handleAddToCart = () => {
    if (selectedSizeOos) return;
    addSelectedToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (!product) return null;

  return (
    <main className="pdp-outer" style={{ padding: '56px 48px 96px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="pdp-inner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
        {/* Left: Images */}
        <div>
          {/* Main image */}
          <div
            className="flex items-center justify-center mb-4"
            onClick={() => images?.[activeImage] && setLightbox(true)}
            style={{
              aspectRatio: '4/5', position: 'relative', overflow: 'hidden',
              background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 12px,#dcd9d2 12px,#dcd9d2 24px)',
              cursor: images?.[activeImage] ? 'zoom-in' : 'default',
            }}
          >
            {images?.[activeImage] ? (
              <img
                key={activeImage}
                src={images[activeImage]}
                alt={`${product.name} ${activeImage + 1}`}
                className="pdp-img"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ font: "600 11px 'Inter',monospace", letterSpacing: '0.15em', color: '#8a8a86', textTransform: 'uppercase' }}>
                Product Shot {activeImage + 1} / 3
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="pdp-thumbs flex gap-3">
            {[0, 1, 2].map(i => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                style={{
                  width: 84, height: 100, cursor: 'pointer', padding: 0, position: 'relative', overflow: 'hidden',
                  border: `2px solid ${activeImage === i ? '#0a0a0a' : 'transparent'}`,
                  background: 'repeating-linear-gradient(45deg,#e7e5e0,#e7e5e0 8px,#dcd9d2 8px,#dcd9d2 16px)',
                }}
              >
                {images?.[i] && (
                  <img src={images[i]} alt={`${product.name} ${i + 1}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <div style={{ font: "600 11px/1 'Inter',sans-serif", letterSpacing: '0.16em', color: '#6b6b6b', marginBottom: 14 }}>
            {product.categoryLabel}
          </div>
          <h1 className="pdp-title" style={{ font: "800 36px/1.15 'Archivo',sans-serif", margin: '0 0 14px', letterSpacing: '-0.01em' }}>
            {product.name}
          </h1>
          <div className="pdp-price" style={{ font: "600 20px 'Inter',sans-serif", marginBottom: 28 }}>
            {product.priceLabel}
          </div>
          <p style={{ font: "400 15px/1.7 'Inter',sans-serif", color: '#4a4a48', maxWidth: 440, margin: '0 0 32px' }}>
            A considered piece cut from premium materials, finished by hand for a silhouette built to outlast the season.
          </p>

          {/* Size */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.14em' }}>SIZE</div>
            <button
              onClick={() => setSizeGuideOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, font: "500 12px 'Inter',sans-serif", color: '#0a0a0a', textDecoration: 'underline', padding: 0 }}
            >
              Size guide
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          </div>
          <div className="pdp-sizes flex gap-[10px]" style={{ marginBottom: 24 }}>
            {SIZES.map(sz => {
              const oos = isSizeOutOfStock(sz);
              return (
                <button
                  key={sz}
                  onClick={() => !oos && selectSize(sz)}
                  disabled={oos}
                  title={oos ? 'Out of stock' : undefined}
                  style={{
                    width: 48, height: 44, cursor: oos ? 'not-allowed' : 'pointer',
                    border: `1px solid ${selectedSize === sz ? '#0a0a0a' : 'rgba(10,10,10,0.3)'}`,
                    background: oos ? '#f5f5f3' : selectedSize === sz ? '#0a0a0a' : 'none',
                    color: oos ? '#c0bdb8' : selectedSize === sz ? '#fff' : '#0a0a0a',
                    font: "500 12px 'Inter',sans-serif",
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {sz}
                  {oos && (
                    <span style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none',
                    }}>
                      <span style={{ position: 'absolute', width: '130%', height: 1, background: '#c0bdb8', transform: 'rotate(-45deg)' }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {sizeError && (
            <div style={{ font: "500 12px 'Inter',sans-serif", color: '#b02a2a', marginBottom: 16 }}>
              Please select a size.
            </div>
          )}
          {selectedSizeOos && (
            <div style={{ font: "500 12px 'Inter',sans-serif", color: '#b02a2a', marginBottom: 16 }}>
              This size is currently out of stock.
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-[14px]" style={{ marginTop: 16, marginBottom: 16 }}>
            <button
              onClick={handleAddToCart}
              disabled={selectedSizeOos}
              className={added ? 'added-btn' : ''}
              style={{
                flex: 1, border: 'none', padding: 18,
                font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em',
                cursor: selectedSizeOos ? 'not-allowed' : 'pointer',
                background: selectedSizeOos ? '#c0bdb8' : '#0a0a0a',
                color: '#fff',
                transition: 'background 0.3s ease',
              }}
            >
              {selectedSizeOos ? 'OUT OF STOCK' : added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="text-lg cursor-pointer"
              style={{ width: 56, border: '1px solid #0a0a0a', background: 'none' }}
            >
              {wished ? '♥' : '♡'}
            </button>
          </div>

          {/* Accordion */}
          <div style={{ borderTop: '1px solid rgba(10,10,10,0.12)' }}>
            <button
              onClick={toggleMaterials}
              className="w-full flex justify-between bg-transparent border-none cursor-pointer py-[18px]"
              style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.08em' }}
            >
              MATERIALS &amp; CARE <span>{materialsOpen ? '−' : '+'}</span>
            </button>
            {materialsOpen && (
              <p style={{ font: "400 14px/1.6 'Inter',sans-serif", color: '#4a4a48', paddingBottom: 18, margin: 0 }}>
                Premium natural fibers, finished by hand. Dry clean recommended.
              </p>
            )}
          </div>
          <div style={{ borderTop: '1px solid rgba(10,10,10,0.12)' }}>
            <button
              onClick={toggleShipping}
              className="w-full flex justify-between bg-transparent border-none cursor-pointer py-[18px]"
              style={{ font: "700 12px 'Inter',sans-serif", letterSpacing: '0.08em' }}
            >
              SHIPPING &amp; RETURNS <span>{shippingOpen ? '−' : '+'}</span>
            </button>
            {shippingOpen && (
              <p style={{ font: "400 14px/1.6 'Inter',sans-serif", color: '#4a4a48', paddingBottom: 18, margin: 0 }}>
                Complimentary shipping and returns within 30 days.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && images?.[activeImage] && (
        <div
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(10,10,10,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'viewFadeIn 0.25s ease both',
            cursor: 'zoom-out',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'absolute', top: 24, right: 28,
              background: 'none', border: 'none', color: '#fff',
              fontSize: 32, cursor: 'pointer', lineHeight: 1, opacity: 0.8,
            }}
          >×</button>

          {/* Prev / Next arrows */}
          {(images?.length ?? 0) > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActiveImage((activeImage - 1 + (images?.length ?? 1)) % (images?.length ?? 1)); }}
                style={{ position: 'absolute', left: 24, background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', opacity: 0.7, lineHeight: 1 }}
              >‹</button>
              <button
                onClick={e => { e.stopPropagation(); setActiveImage((activeImage + 1) % (images?.length ?? 1)); }}
                style={{ position: 'absolute', right: 24, background: 'none', border: 'none', color: '#fff', fontSize: 36, cursor: 'pointer', opacity: 0.7, lineHeight: 1 }}
              >›</button>
            </>
          )}

          {/* Full image */}
          <img
            src={images[activeImage]}
            alt={product.name}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '90vw', maxHeight: '90vh',
              objectFit: 'contain',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              animation: 'viewFadeIn 0.3s ease both',
            }}
          />

          {/* Dot indicators */}
          {(images?.length ?? 0) > 1 && (
            <div style={{ position: 'absolute', bottom: 24, display: 'flex', gap: 8 }}>
              {images!.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActiveImage(i); }}
                  style={{
                    width: activeImage === i ? 20 : 8, height: 8, borderRadius: 4,
                    background: activeImage === i ? '#fff' : 'rgba(255,255,255,0.4)',
                    border: 'none', cursor: 'pointer', padding: 0,
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews */}
      <ReviewsSection productId={product.id} />

      {/* Related */}
      <section className="related-section" style={{ marginTop: 96 }}>
        <h2 style={{ font: "800 24px 'Archivo',sans-serif", margin: '0 0 32px', letterSpacing: '-0.01em' }}>YOU MAY ALSO LIKE</h2>
        <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 28 }}>
          {related.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={p => selectProduct(p.id)}
              onQuickAdd={p => quickAdd(p.id)}
            />
          ))}
        </div>
      </section>

      {/* Size Guide Modal — uses portal-style fixed overlay */}
      {sizeGuideOpen && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div
          onClick={() => setSizeGuideOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,10,10,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'viewFadeIn 0.2s ease both' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 12, maxWidth: 560, width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '36px 32px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ font: "800 20px 'Archivo',sans-serif", margin: 0, letterSpacing: '-0.01em' }}>SIZE GUIDE</h3>
              <button onClick={() => setSizeGuideOpen(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#6b6b6b', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ font: "600 11px 'Inter',sans-serif", letterSpacing: '0.12em', color: '#9a9a96', marginBottom: 12 }}>MEASUREMENTS (INCHES)</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', font: "400 13px 'Inter',sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #0a0a0a' }}>
                  {['Size', 'Chest', 'Waist', 'Hips', 'Length'].map(h => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', font: "700 11px 'Inter',sans-serif", letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '34', '28', '36', '27'],
                  ['S',  '36', '30', '38', '28'],
                  ['M',  '38', '32', '40', '29'],
                  ['L',  '40', '34', '42', '30'],
                  ['XL', '42', '36', '44', '31'],
                  ['2XL','44', '38', '46', '32'],
                  ['3XL','46', '40', '48', '33'],
                ].map((row, i) => (
                  <tr key={row[0]} style={{ borderBottom: '1px solid rgba(10,10,10,0.08)', background: i % 2 === 0 ? '#f9f8f6' : '#fff' }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: '10px 8px', fontWeight: j === 0 ? 700 : 400 }}>{cell}"</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 24, font: "400 13px/1.6 'Inter',sans-serif", color: '#6b6b6b' }}>
              <strong style={{ color: '#0a0a0a' }}>How to measure:</strong> Take measurements over undergarments. Keep the tape measure snug but not tight. If you're between sizes, we recommend sizing up for a relaxed fit.
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
