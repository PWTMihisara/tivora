'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/store/useStore';
import WishlistDrawer from './WishlistDrawer';
import SearchOverlay from './SearchOverlay';

export default function Header({ onOpenAuth }: { onOpenAuth?: () => void }) {
  const goHome         = useStore(s => s.goHome);
  const goCollections  = useStore(s => s.goCollections);
  const goPLPAll       = useStore(s => s.goPLPAll);
  const goPLPMen       = useStore(s => s.goPLPMen);
  const goPLPWomen     = useStore(s => s.goPLPWomen);
  const openCart       = useStore(s => s.openCart);
  const cartCount      = useStore(s => s.cart.reduce((n, c) => n + c.qty, 0));
  const user           = useStore(s => s.user);
  const goAccount      = useStore(s => s.goAccount);

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

        {/* Mobile: hamburger only */}
        <div className="mobile-menu-btn items-center gap-4">
          <button
            className="bg-transparent border-none cursor-pointer flex flex-col gap-[5px]"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#0a0a0a' }} />
            ))}
          </button>
        </div>

        {/* Center logo */}
        <button
          onClick={goHome}
          className="absolute left-1/2 -translate-x-1/2 bg-transparent border-none cursor-pointer p-0"
        >
          <Image src="/tivora-logo.png" alt="TIVORA" height={110} width={380} className="logo-img block h-[110px] w-auto" style={{ filter: 'brightness(0)' }} />
        </button>

        {/* Right actions */}
        <div className="flex items-center gap-[22px]">
          {/* Dark mode toggle — hidden on mobile (shown in mobile nav) */}
          <button
            onClick={toggleDark}
            className="bg-transparent border-none cursor-pointer dark-toggle hidden sm:flex"
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

          {/* Account */}
          <button
            onClick={() => user ? goAccount() : onOpenAuth?.()}
            className="bg-transparent border-none cursor-pointer hidden sm:flex items-center gap-[6px]"
            aria-label="Account"
            style={{ color: '#0a0a0a', padding: 0 }}
          >
            {user ? (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#0a0a0a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: "700 10px/1 'Inter',sans-serif" }}>
                {user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </button>

          <button
            onClick={openCart}
            className="cursor-pointer bg-transparent border-none"
            aria-label="Open cart"
            style={{ color: '#0a0a0a', padding: 0, position: 'relative', lineHeight: 1 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -7, right: -8,
                background: '#0a0a0a', color: '#fff',
                borderRadius: '50%', width: 16, height: 16,
                font: "700 9px/16px 'Inter',sans-serif",
                textAlign: 'center', display: 'block',
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Dark mode toggle — mobile only */}
          <button
            onClick={toggleDark}
            className="bg-transparent border-none cursor-pointer sm:hidden"
            aria-label="Toggle dark mode"
            style={{ color: '#0a0a0a', padding: 0, lineHeight: 1 }}
          >
            {dark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
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
          <button
            onClick={() => { setMobileOpen(false); user ? goAccount() : onOpenAuth?.(); }}
            className="mobile-nav-link bg-transparent border-none cursor-pointer"
            style={{ font: "700 20px/1 'Archivo',sans-serif", letterSpacing: '0.14em', color: '#0a0a0a' }}
          >
            {user ? 'MY ACCOUNT' : 'SIGN IN'}
          </button>

        </div>
      )}

      {/* Wishlist drawer */}
      <WishlistDrawer open={wishlistOpen} onClose={() => setWishlistOpen(false)} />

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
