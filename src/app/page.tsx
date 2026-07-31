'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useSharedStore } from '@/store/useSharedStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import HomeView from '@/components/home/HomeView';
import PLPView from '@/components/plp/PLPView';
import PDPView from '@/components/pdp/PDPView';
import CheckoutView from '@/components/checkout/CheckoutView';
import ConfirmationView from '@/components/confirmation/ConfirmationView';
import CollectionsView from '@/components/collections/CollectionsView';

export default function Page() {
  const view            = useStore(s => s.view);
  const setProductImages = useSharedStore(s => s.setProductImages);
  const setCollectionBanner = useSharedStore(s => s.setCollectionBanner);

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
      <Header />

      {view === 'home'         && <HomeView />}
      {view === 'collections'  && <CollectionsView />}
      {view === 'plp'          && <PLPView />}
      {view === 'pdp'          && <PDPView />}
      {view === 'checkout'     && <CheckoutView />}
      {view === 'confirmation' && <ConfirmationView />}

      {view !== 'confirmation' && <Footer />}

      <CartDrawer />
    </div>
  );
}
