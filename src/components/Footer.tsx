'use client';

import Image from 'next/image';
import { useStore } from '@/store/useStore';

export default function Footer() {
  const goPLPMen   = useStore(s => s.goPLPMen);
  const goPLPWomen = useStore(s => s.goPLPWomen);
  const goPLPAll   = useStore(s => s.goPLPAll);

  return (
    <footer className="footer-inner" style={{ background: '#0a0a0a', color: '#fff', padding: '72px 48px 32px' }}>
      <div
        className="footer-grid grid gap-12 mb-14"
        style={{ gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr' }}
      >
        {/* Brand */}
        <div>
          <Image
            src="/tivora-logo.png"
            alt="TIVORA"
            height={100}
            width={340}
            className="mb-4 block h-[100px] w-auto"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <p style={{ font: "400 13px/1.6 'Inter',sans-serif", color: '#9a9a96', maxWidth: 260 }}>
            Considered clothing for a considered life. Designed in monochrome, built to last.
          </p>
        </div>

        {/* Shop */}
        <div>
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>SHOP</div>
          <div className="flex flex-col gap-[10px]">
            {[
              { label: 'Men',          onClick: goPLPMen },
              { label: 'Women',        onClick: goPLPWomen },
              { label: 'All Products', onClick: goPLPAll },
            ].map(({ label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="text-left bg-transparent border-none cursor-pointer hover:text-white transition-colors"
                style={{ font: "400 13px 'Inter',sans-serif", color: '#c9c9c6' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Help */}
        <div>
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>HELP</div>
          <div className="flex flex-col gap-[10px]">
            {['Shipping', 'Returns', 'Contact'].map(item => (
              <span key={item} style={{ font: "400 13px 'Inter',sans-serif", color: '#c9c9c6' }}>{item}</span>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <div style={{ font: "700 11px 'Inter',sans-serif", letterSpacing: '0.12em', marginBottom: 16 }}>NEWSLETTER</div>
          <div className="flex pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>
            <input
              placeholder="Email address"
              className="flex-1 bg-transparent border-none outline-none"
              style={{ font: "400 13px 'Inter',sans-serif", color: '#fff' }}
            />
            <button
              className="bg-transparent border-none cursor-pointer"
              style={{ font: "700 12px 'Inter',sans-serif", color: '#fff' }}
            >→</button>
          </div>
        </div>
      </div>

      <div
        className="flex justify-between pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.15)', font: "400 12px 'Inter',sans-serif", color: '#7a7a76' }}
      >
        <span>© 2026 Tivora Clothing</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}
