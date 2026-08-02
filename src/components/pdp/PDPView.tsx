'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { SIZES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
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

  const [added, setAdded]         = useState(false);
  const [lightbox, setLightbox]   = useState(false);

  const product = selectedProduct();
  const related = relatedProducts();
  const savedImages = useSharedStore(s => s.productImages[product?.id ?? '']);
  const images = savedImages?.length ? savedImages : product?.images;

  const handleAddToCart = () => {
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
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.14em', marginBottom: 12 }}>SIZE</div>
          <div className="pdp-sizes flex gap-[10px]" style={{ marginBottom: 24 }}>
            {SIZES.map(sz => (
              <button
                key={sz}
                onClick={() => selectSize(sz)}
                style={{
                  width: 48, height: 44, cursor: 'pointer',
                  border: `1px solid ${selectedSize === sz ? '#0a0a0a' : 'rgba(10,10,10,0.3)'}`,
                  background: selectedSize === sz ? '#0a0a0a' : 'none',
                  color: selectedSize === sz ? '#fff' : '#0a0a0a',
                  font: "500 12px 'Inter',sans-serif",
                }}
              >
                {sz}
              </button>
            ))}
          </div>
          {sizeError && (
            <div style={{ font: "500 12px 'Inter',sans-serif", color: '#b02a2a', marginBottom: 16 }}>
              Please select a size.
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-[14px]" style={{ marginTop: 16, marginBottom: 16 }}>
            <button
              onClick={handleAddToCart}
              className={added ? 'added-btn' : ''}
              style={{
                flex: 1, background: '#0a0a0a', color: '#fff', border: 'none',
                padding: 18, font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
            >
              {added ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
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
    </main>
  );
}
