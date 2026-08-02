'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import WishlistDrawer from './WishlistDrawer';
import SearchOverlay from './SearchOverlay';

export default function Header() {
  const goHome         = useStore(s => s.goHome);
  const goCollections  = useStore(s => s.goCollections);
  const goPLPAll       = useStore(s => s.goPLPAll);
  const goPLPMen       = useStore(s => s.goPLPMen);
  const goPLPWomen     = useStore(s => s.goPLPWomen);
  const openCart   = useStore(s => s.openCart);
  const cartCount  = useStore(s => s.cart.reduce((n, c) => n + c.qty, 0));

  // Subscribe directly to wishlist for reactive count
  const wishlist       = useStore(s => s.wishlist);
  const wishlistCount  = Object.values(wishlist).filter(Boolean).length;

  const [mobileOpen, setMobileOpen]     = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const [dark, setDark]                 = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('tivora-dark') === '1';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('tivora-dark', next ? '1' : '0');
    document.documentElement.classList.toggle('dark', next);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'ALL',         onClick: goPLPAll },
    { label: 'MEN',         onClick: goPLPMen },
    { label: 'WOMEN',       onClick: goPLPWomen },
    { label: 'COLLECTIONS', onClick: goCollections },
  ];

  const handleNav = (onClick: () => void) => { onClick(); setMobileOpen(false); };

  return (
    <>
      <header
        className="header-inner sticky top-0 z-40 flex items-center justify-between"
        style={{
          height: 88,
          padding: '0 48px',
          background: 'rgba(253,253,252,0.96)',
          backdropFilter: 'blur(6px)',
          borderBottom: '1px solid rgba(10,10,10,0.12)',
          boxShadow: scrolled ? '0 4px 24px rgba(10,10,10,0.08)' : 'none',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Left nav — desktop */}
        <nav className="header-nav flex items-center gap-7">
          {navLinks.map(({ label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="header-nav-link bg-transparent border-none cursor-pointer"
              style={{ font: "600 12px/1 'Inter',sans-serif", letterSpacing: '0.14em', color: '#0a0a0a' }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-menu-btn bg-transparent border-none cursor-pointer flex-col gap-[5px]"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#0a0a0a' }} />
          ))}
        </button>

        {/* Center logo */}
        <button
          onClick={goHome}
          className="absolute left-1/2 -translate-x-1/2 bg-transparent border-none cursor-pointer p-0"
        >
          <Image src="/tivora-logo.png" alt="TIVORA" height={110} width={380} className="logo-img block h-[110px] w-auto" style={{ filter: 'brightness(0)' }} />
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-[22px]">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="bg-transparent border-none cursor-pointer dark-toggle"
            aria-label="Toggle dark mode"
            style={{ color: '#0a0a0a', padding: 0, lineHeight: 1 }}
          >
            {dark ? (
              /* Sun icon */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="bg-transparent border-none cursor-pointer hidden sm:flex"
            aria-label="Search"
            style={{ color: '#0a0a0a', padding: 0 }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Wishlist — opens drawer */}
          <button
            onClick={() => setWishlistOpen(true)}
            className="bg-transparent border-none cursor-pointer items-center gap-[6px] hidden sm:flex"
            style={{ font: "600 12px/1 'Inter',sans-serif", letterSpacing: '0.1em', color: '#0a0a0a' }}
          >
            <span className="text-[15px]">{wishlistCount > 0 ? '♥' : '♡'}</span>
            <span>{wishlistCount}</span>
          </button>

          <button
            onClick={openCart}
            className="cursor-pointer"
            style={{
              background: 'none',
              border: '1px solid #0a0a0a',
              padding: '8px 14px',
              font: "600 12px/1 'Inter',sans-serif",
              letterSpacing: '0.1em',
              color: '#0a0a0a',
            }}
          >
            BAG ({cartCount})
          </button>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="mobile-nav">
          <button
            className="absolute top-6 right-6 bg-transparent border-none text-2xl cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
          {navLinks.map(({ label, onClick }) => (
            <button
              key={label}
              onClick={() => handleNav(onClick)}
              className="mobile-nav-link bg-transparent border-none cursor-pointer"
              style={{ font: "700 20px/1 'Archivo',sans-serif", letterSpacing: '0.14em', color: '#0a0a0a' }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Wishlist drawer */}
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
