'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SharedOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  address: string;
  items: { name: string; variant: string; qty: number; price: number }[];
  payment: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shipping: number;
  tax: number;
  itemCount: number;
  subtotal: number;
  total: number;
}

interface SharedState {
  orders: SharedOrder[];
  addOrder: (order: SharedOrder) => void;
  updateOrderStatus: (id: string, status: SharedOrder['status']) => void;

  // Product images keyed by product ID (base64 or URL strings)
  productImages: Record<string, string[]>;
  setProductImages: (id: string, images: string[]) => void;

  // Product name/price overrides from Supabase (admin edits)
  productOverrides: Record<string, { name?: string; price?: number }>;
  setProductOverride: (id: string, data: { name?: string; price?: number }) => void;

  // Collection banner images keyed by collection name
  collectionBanners: Record<string, string>;
  setCollectionBanner: (name: string, image: string) => void;
}

export const useSharedStore = create<SharedState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set(s => ({ orders: [order, ...s.orders] })),
      updateOrderStatus: (id, status) =>
        set(s => ({ orders: s.orders.map(o => o.id === id ? { ...o, status } : o) })),

      productImages: {},
      setProductImages: (id, images) =>
        set(s => ({ productImages: { ...s.productImages, [id]: images } })),

      productOverrides: {},
      setProductOverride: (id, data) =>
        set(s => ({ productOverrides: { ...s.productOverrides, [id]: { ...s.productOverrides[id], ...data } } })),

      collectionBanners: {},
      setCollectionBanner: (name, image) =>
        set(s => ({ collectionBanners: { ...s.collectionBanners, [name]: image } })),
    }),
    {
      name: 'tivora-shared',
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
