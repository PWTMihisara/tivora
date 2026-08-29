'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomeView from '@/components/home/HomeView';
import PLPView from '@/components/plp/PLPView';
import PDPView from '@/components/pdp/PDPView';
import CheckoutView from '@/components/checkout/CheckoutView';
import ConfirmationView from '@/components/confirmation/ConfirmationView';
import CollectionsView from '@/components/collections/CollectionsView';
import AccountView from '@/components/account/AccountView';
import FAQView from '@/components/faq/FAQView';
import TrackingView from '@/components/tracking/TrackingView';
import AuthModal from '@/components/auth/AuthModal';

export default function Page() {
  const view                = useStore(s => s.view);
  const setUser             = useStore(s => s.setUser);
  const setProductImages    = useSharedStore(s => s.setProductImages);
  const setProductOverride  = useSharedStore(s => s.setProductOverride);
  const setInventory        = useSharedStore(s => s.setInventory);
  const setCollectionBanner = useSharedStore(s => s.setCollectionBanner);
  const [authOpen, setAuthOpen] = useState(false);
  const [announcementBar, setAnnouncementBar] = useState('FREE SHIPPING ON ORDERS OVER Rs. 3,000 \u00a0·\u00a0 30-DAY RETURNS');

  // Restore Supabase session on mount
  useEffect(() => {
    const mapUser = (u: { id: string; email?: string; user_metadata?: Record<string, unknown> }) => ({
      id:      u.id,
      email:   u.email!,
      name:    (u.user_metadata?.name as string)    || u.email!.split('@')[0],
      address: (u.user_metadata?.address as string) || '',
      city:    (u.user_metadata?.city as string)    || '',
      zip:     (u.user_metadata?.zip as string)     || '',
      phone:   (u.user_metadata?.phone as string)   || '',
    });
    const syncWishlist = (userId: string) => {
      fetch(`/api/wishlist?user_id=${userId}`)
        .then(r => r.json())
        .then((data: { product_id: string }[]) => {
          if (Array.isArray(data) && data.length > 0) {
            const wl: Record<string, boolean> = {};
            data.forEach(d => { wl[d.product_id] = true; });
            // Merge with local wishlist (local takes priority for items, backend adds missing)
            const current = useStore.getState().wishlist;
            useStore.setState({ wishlist: { ...wl, ...current } });
          }
        })
        .catch(console.error);
    };
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) { setUser(mapUser(u)); syncWishlist(u.id); }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) { setUser(mapUser(u)); syncWishlist(u.id); }
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  useEffect(() => {
    // Load real product images from Supabase
    fetch('/api/products')
      .then(r => r.json())
      .then((data: { id: string; name?: string; price?: number; images: string[] | null }[]) => {
        if (Array.isArray(data)) {
          data.forEach(p => {
            if (p.images?.length) setProductImages(p.id, p.images);
            if (p.name || p.price != null) setProductOverride(p.id, { name: p.name, price: p.price });
          });
        }
      })
      .catch(console.error);

    // Load inventory stock
    fetch('/api/inventory')
      .then(r => r.json())
      .then((data: { product_id: string; variant: string; stock: number }[]) => {
        if (Array.isArray(data)) {
          data.forEach(row => {
            if (row.product_id) setInventory(row.product_id, row.variant, row.stock);
          });
        }
      })
      .catch(console.error);

    // Load collection banners from Supabase
    fetch('/api/collections')
      .then(r => r.json())
      .then((data: { name: string; banner_url: string | null }[]) => {
        if (Array.isArray(data)) {
          data.forEach(c => {
            if (c.banner_url) setCollectionBanner(c.name, c.banner_url);
          });
        }
      })
      .catch(console.error);

    // Load product discounts
    fetch('/api/discounts')
      .then(r => r.json())
      .then((data: { product_id: string; discount_type: 'percentage' | 'fixed'; discount_value: number; label?: string; active: boolean }[]) => {
        if (Array.isArray(data)) {
          const setDiscount = useSharedStore.getState().setProductDiscount;
          data.filter(d => d.active).forEach(d => setDiscount(d.product_id, { discount_type: d.discount_type, discount_value: d.discount_value, label: d.label }));
        }
      })
      .catch(console.error);

    // Load site settings (announcement bar etc.)
    fetch('/api/settings')
      .then(r => r.json())
      .then((data: Record<string, string>) => {
        if (data.announcement_bar) setAnnouncementBar(data.announcement_bar);
      })
      .catch(console.error);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fdfdfc', color: '#0a0a0a' }}>
      {/* Announcement Bar */}
      <div className="announcement-bar" style={{ background: '#0a0a0a', color: '#fff', textAlign: 'center', padding: '10px 16px', font: "500 11px/1 'Inter',sans-serif", letterSpacing: '0.1em' }}>
        {announcementBar}
      </div>
      <Header onOpenAuth={() => setAuthOpen(true)} />

      {view === 'home'         && <div key="home"         className="view-fade"><HomeView /></div>}
      {view === 'collections'  && <div key="collections"  className="view-fade"><CollectionsView /></div>}
      {view === 'plp'          && <div key="plp"          className="view-fade"><PLPView /></div>}
      {view === 'pdp'          && <div key="pdp"          className="view-fade"><PDPView /></div>}
      {view === 'checkout'     && <div key="checkout"     className="view-fade"><CheckoutView /></div>}
      {view === 'confirmation' && <div key="confirmation" className="view-fade"><ConfirmationView /></div>}
      {view === 'account'      && <div key="account"      className="view-fade"><AccountView /></div>}
      {view === 'faq'          && <div key="faq"          className="view-fade"><FAQView /></div>}
      {view === 'tracking'     && <div key="tracking"     className="view-fade"><TrackingView /></div>}

      {view !== 'confirmation' && <Footer />}

      <CartDrawer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
