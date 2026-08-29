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

  // Inventory stock: productId -> size -> stock count
  inventory: Record<string, Record<string, number>>;
  setInventory: (productId: string, size: string, stock: number) => void;

  // Collection banner images keyed by collection name
  collectionBanners: Record<string, string>;
  setCollectionBanner: (name: string, image: string) => void;

  // Product discounts keyed by product ID
  productDiscounts: Record<string, { discount_type: 'percentage' | 'fixed'; discount_value: number; label?: string }>;
  setProductDiscount: (id: string, data: { discount_type: 'percentage' | 'fixed'; discount_value: number; label?: string }) => void;
  removeProductDiscount: (id: string) => void;
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

      inventory: {},
      setInventory: (productId, size, stock) =>
        set(s => ({ inventory: { ...s.inventory, [productId]: { ...s.inventory[productId], [size]: stock } } })),

      collectionBanners: {},
      setCollectionBanner: (name, image) =>
        set(s => ({ collectionBanners: { ...s.collectionBanners, [name]: image } })),

      productDiscounts: {},
      setProductDiscount: (id, data) =>
        set(s => ({ productDiscounts: { ...s.productDiscounts, [id]: data } })),
      removeProductDiscount: (id) =>
        set(s => {
          const next = { ...s.productDiscounts };
          delete next[id];
          return { productDiscounts: next };
        }),
    }),
    {
      name: 'tivora-shared',
      partialize: (state) => ({ orders: state.orders }),
    }
  )
);
