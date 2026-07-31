'use client';

import { useStore } from '@/store/useStore';

export default function ConfirmationView() {
  const goHome = useStore(s => s.goHome);

  return (
    <main className="flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div
        className="text-center"
        style={{ maxWidth: 440, padding: '64px 48px', border: '1px solid rgba(10,10,10,0.12)' }}
      >
        <div
          className="flex items-center justify-center mx-auto mb-6 text-xl"
          style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid #0a0a0a' }}
        >
          ✓
        </div>
        <h1 style={{ font: "800 24px 'Archivo',sans-serif", margin: '0 0 12px', letterSpacing: '-0.01em' }}>ORDER CONFIRMED</h1>
        <p style={{ font: "400 14px 'Inter',sans-serif", color: '#6b6b6b', margin: '0 0 32px' }}>
          Order TVR-00482 — a confirmation has been sent to your email.
        </p>
        <button
          onClick={goHome}
          style={{ background: '#0a0a0a', color: '#fff', border: 'none', padding: '16px 32px', font: "700 12px/1 'Inter',sans-serif", letterSpacing: '0.12em', cursor: 'pointer' }}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </main>
  );
}
