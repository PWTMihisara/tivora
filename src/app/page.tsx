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
import AuthModal from '@/components/auth/AuthModal';

export default function Page() {
  const view                = useStore(s => s.view);
  const setUser             = useStore(s => s.setUser);
  const setProductImages    = useSharedStore(s => s.setProductImages);
  const setCollectionBanner = useSharedStore(s => s.setCollectionBanner);
  const [authOpen, setAuthOpen] = useState(false);

  // Restore Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUser({ id: u.id, email: u.email!, name: (u.user_metadata?.name as string) || u.email!.split('@')[0] });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      if (u) setUser({ id: u.id, email: u.email!, name: (u.user_metadata?.name as string) || u.email!.split('@')[0] });
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
      .then((data: { id: string; images: string[] | null }[]) => {
        if (Array.isArray(data)) {
          data.forEach(p => {
            if (p.images?.length) setProductImages(p.id, p.images);
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
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#fdfdfc', color: '#0a0a0a' }}>
      <Header onOpenAuth={() => setAuthOpen(true)} />

      {view === 'home'         && <div key="home"         className="view-fade"><HomeView /></div>}
      {view === 'collections'  && <div key="collections"  className="view-fade"><CollectionsView /></div>}
      {view === 'plp'          && <div key="plp"          className="view-fade"><PLPView /></div>}
      {view === 'pdp'          && <div key="pdp"          className="view-fade"><PDPView /></div>}
      {view === 'checkout'     && <div key="checkout"     className="view-fade"><CheckoutView /></div>}
      {view === 'confirmation' && <div key="confirmation" className="view-fade"><ConfirmationView /></div>}
      {view === 'account'      && <div key="account"      className="view-fade"><AccountView /></div>}

      {view !== 'confirmation' && <Footer />}

      <CartDrawer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
