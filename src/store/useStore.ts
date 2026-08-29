'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartLine, CheckoutForm, HomeVariant, Size, SortBy, View } from '@/types';
import { PRODUCTS, money } from '@/data/products';
import { useSharedStore } from '@/store/useSharedStore';

interface StoreState {
  view: View;
  homeVariant: HomeVariant;
  cartOpen: boolean;
  cart: CartLine[];
  wishlist: Record<string, boolean>;
  filterGender: 'all' | 'men' | 'women';
  filterCategory: string;
  sortBy: SortBy;
  searchQuery: string;
  selectedProductId: string | null;
  activeImage: number;
  selectedSize: Size | null;
  sizeError: boolean;
  materialsOpen: boolean;
  shippingOpen: boolean;
  checkoutForm: CheckoutForm;

  // Navigation
  goHome: () => void;
  goCollections: () => void;
  goFaq: () => void;
  goPLPAll: () => void;
  goPLPMen: () => void;
  goPLPWomen: () => void;
  setHomeVariant: (v: HomeVariant) => void;

  // Cart
  openCart: () => void;
  closeCart: () => void;
  addToCart: (productId: string, size: Size) => void;
  addSelectedToCart: () => void;
  quickAdd: (productId: string) => void;
  incLine: (id: string, size: Size) => void;
  decLine: (id: string, size: Size) => void;
  removeLine: (id: string, size: Size) => void;
  goCheckout: () => void;
  placeOrder: () => void;

  // Wishlist
  toggleWishlist: (id: string) => void;

  // PDP
  selectProduct: (id: string) => void;
  setActiveImage: (i: number) => void;
  selectSize: (s: Size) => void;
  toggleMaterials: () => void;
  toggleShipping: () => void;

  // PLP
  setGender: (g: 'all' | 'men' | 'women') => void;
  setCategory: (c: string) => void;
  clearFilters: () => void;
  setSortBy: (s: SortBy) => void;
  setSearchQuery: (q: string) => void;
  goSearch: (q: string) => void;

  // Auth user
  user: { id: string; email: string; name: string; address?: string; city?: string; zip?: string; phone?: string } | null;
  setUser: (user: { id: string; email: string; name: string; address?: string; city?: string; zip?: string; phone?: string } | null) => void;
  goAccount: () => void;
  trackingOrderId: string | null;
  goTracking: (orderId: string) => void;
  fillCheckoutFromProfile: () => void;

  // Last placed order (for confirmation page)
  lastOrder: {
    customerName: string;
    items: { id: string; name: string; size: string; qty: number; price: number; originalPrice?: number; discountLabel?: string }[];
    subtotal: number;
    tax: number;
    total: number;
  } | null;

  // Checkout
  setCheckoutField: (field: keyof CheckoutForm, value: string) => void;

  // Computed helpers
  cartCount: () => number;
  wishlistCount: () => number;
  cartEmpty: () => boolean;
  subtotal: () => number;
  subtotalLabel: () => string;
  cartLines: () => (CartLine & { priceLabel: string; lineTotalLabel: string })[];
  filteredProducts: () => ReturnType<typeof withMeta>[];
  featuredProducts: () => ReturnType<typeof withMeta>[];
  selectedProduct: () => ReturnType<typeof withMeta> | null;
  relatedProducts: () => ReturnType<typeof withMeta>[];
}

const withMeta = (p: typeof PRODUCTS[0], wishlist: Record<string, boolean>, overrides: Record<string, { name?: string; price?: number }> = {}) => {
  const ov    = overrides[p.id];
  const name  = ov?.name  ?? p.name;
  const price = ov?.price ?? p.price;
  return {
    ...p,
    name,
    price,
    priceLabel: money(price),
    categoryLabel: p.category.toUpperCase() + ' · ' + (p.gender === 'men' ? 'MEN' : 'WOMEN'),
    wished: !!wishlist[p.id],
  };
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
  view: 'home',
  homeVariant: 1,
  cartOpen: false,
  cart: [],
  wishlist: {},
  filterGender: 'all',
  filterCategory: 'all',
  sortBy: 'newest',
  searchQuery: '',
  selectedProductId: null,
  activeImage: 0,
  selectedSize: null,
  sizeError: false,
  materialsOpen: false,
  shippingOpen: false,
  checkoutForm: { name: '', email: '', phone: '', address: '', city: '', zip: '' },
  lastOrder: null,
  user: null,
  trackingOrderId: null,
  setUser: (user) => set({ user }),
  goAccount: () => set({ view: 'account' }),
  goTracking: (orderId) => set({ view: 'tracking', trackingOrderId: orderId }),
  fillCheckoutFromProfile: () => {
    const { user } = get();
    if (!user) return;
    set({ checkoutForm: {
      name:    user.name    || '',
      email:   user.email   || '',
      phone:   user.phone   || '',
      address: user.address || '',
      city:    user.city    || '',
      zip:     user.zip     || '',
    }});
  },

  goHome: () => set({ view: 'home' }),
  goCollections: () => set({ view: 'collections' }),
  goFaq: () => set({ view: 'faq' }),
  goPLPAll: () => set({ view: 'plp', filterGender: 'all' }),
  goPLPMen: () => set({ view: 'plp', filterGender: 'men' }),
  goPLPWomen: () => set({ view: 'plp', filterGender: 'women' }),
  setHomeVariant: (v) => set({ homeVariant: v }),

  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),

  addToCart: (productId, size) => {
    if (!size) { set({ sizeError: true }); return; }
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    const shared = useSharedStore.getState();
    const ov = shared.productOverrides[productId];
    const discount = shared.productDiscounts[productId];
    const name  = ov?.name  ?? product.name;
    let price = ov?.price ?? product.price;
    if (discount) {
      price = discount.discount_type === 'percentage'
        ? price * (1 - discount.discount_value / 100)
        : Math.max(0, price - discount.discount_value);
      price = Math.round(price * 100) / 100;
    }
    set(s => {
      const idx = s.cart.findIndex(c => c.id === productId && c.size === size);
      let cart: CartLine[];
      if (idx > -1) {
        cart = [...s.cart];
        cart[idx] = { ...cart[idx], qty: cart[idx].qty + 1 };
      } else {
        cart = [...s.cart, { id: product.id, name, price, size, qty: 1 }];
      }
      return { cart, cartOpen: true, sizeError: false };
    });
  },

  addSelectedToCart: () => {
    const { selectedProductId, selectedSize, addToCart } = get();
    if (!selectedProductId) return;
    if (!selectedSize) { set({ sizeError: true }); return; }
    addToCart(selectedProductId, selectedSize);
  },

  quickAdd: (productId) => {
    get().addToCart(productId, 'M');
  },

  incLine: (id, size) => set(s => ({ cart: s.cart.map(c => c.id === id && c.size === size ? { ...c, qty: c.qty + 1 } : c) })),
  decLine: (id, size) => set(s => ({ cart: s.cart.map(c => c.id === id && c.size === size ? { ...c, qty: c.qty - 1 } : c).filter(c => c.qty > 0) })),
  removeLine: (id, size) => set(s => ({ cart: s.cart.filter(c => !(c.id === id && c.size === size)) })),

  goCheckout: () => set({ view: 'checkout', cartOpen: false }),
  placeOrder: () => {
    const { cart, checkoutForm, subtotal } = get();
    const shared = useSharedStore.getState();
    const sub = subtotal();
    const tax = Math.round(sub * 0.05);
    const total = sub + tax;

    // Build items with discount info for confirmation
    const itemsWithDiscount = cart.map(c => {
      const discount = shared.productDiscounts[c.id];
      const ov = shared.productOverrides[c.id];
      const basePrice = ov?.price ?? (PRODUCTS.find(p => p.id === c.id)?.price ?? c.price);
      const hasDiscount = discount && basePrice !== c.price;
      return {
        id: c.id, name: c.name, size: c.size, qty: c.qty, price: c.price,
        originalPrice: hasDiscount ? basePrice : undefined,
        discountLabel: hasDiscount
          ? (discount.label || (discount.discount_type === 'percentage' ? `${discount.discount_value}% OFF` : `Rs. ${discount.discount_value} OFF`))
          : undefined,
      };
    });

    // Save to real database
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: checkoutForm.name || 'Guest',
        email:    checkoutForm.email,
        phone:    checkoutForm.phone || null,
        address:  [checkoutForm.address, checkoutForm.city, checkoutForm.zip].filter(Boolean).join(', '),
        items:    itemsWithDiscount.map(c => ({ name: c.name, size: c.size, qty: c.qty, price: c.price, originalPrice: c.originalPrice, discountLabel: c.discountLabel })),
        payment:  'Pending',
        shipping: 0,
        tax,
        subtotal: sub,
        total,
      }),
    }).catch(err => console.error('Order save failed:', err));

    set({
      view: 'confirmation',
      cart: [],
      lastOrder: {
        customerName: checkoutForm.name || 'Guest',
        items: itemsWithDiscount,
        subtotal: sub,
        tax,
        total,
      },
    });
  },

  toggleWishlist: (id) => {
    const { wishlist, user } = get();
    const next = !wishlist[id];
    set({ wishlist: { ...wishlist, [id]: next } });
    // Sync with backend if logged in
    if (user) {
      if (next) {
        fetch('/api/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, product_id: id }) }).catch(console.error);
      } else {
        fetch('/api/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: user.id, product_id: id }) }).catch(console.error);
      }
    }
  },

  selectProduct: (id) => set({ view: 'pdp', selectedProductId: id, activeImage: 0, selectedSize: null, sizeError: false }),
  setActiveImage: (i) => set({ activeImage: i }),
  selectSize: (s) => set({ selectedSize: s, sizeError: false }),
  toggleMaterials: () => set(s => ({ materialsOpen: !s.materialsOpen })),
  toggleShipping: () => set(s => ({ shippingOpen: !s.shippingOpen })),

  setGender: (g) => set({ filterGender: g }),
  setCategory: (c) => set(s => ({ filterCategory: s.filterCategory === c ? 'all' : c })),
  clearFilters: () => set({ filterGender: 'all', filterCategory: 'all', searchQuery: '' }),
  setSortBy: (s) => set({ sortBy: s }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  goSearch: (q) => set({ view: 'plp', filterGender: 'all', filterCategory: 'all', searchQuery: q }),

  setCheckoutField: (field, value) => set(s => ({ checkoutForm: { ...s.checkoutForm, [field]: value } })),

  cartCount: () => get().cart.reduce((n, c) => n + c.qty, 0),
  wishlistCount: () => Object.values(get().wishlist).filter(Boolean).length,
  cartEmpty: () => get().cart.length === 0,
  subtotal: () => get().cart.reduce((n, c) => n + c.price * c.qty, 0),
  subtotalLabel: () => money(get().subtotal()),

  cartLines: () => get().cart.map(c => ({
    ...c,
    priceLabel: money(c.price),
    lineTotalLabel: money(c.price * c.qty),
  })),

  filteredProducts: () => {
    const { filterGender, filterCategory, sortBy, wishlist, searchQuery } = get();
    const overrides = useSharedStore.getState().productOverrides;
    const q = searchQuery.toLowerCase().trim();
    let filtered = PRODUCTS.filter(p => {
      const name = overrides[p.id]?.name ?? p.name;
      return (filterGender === 'all' || p.gender === filterGender) &&
        (filterCategory === 'all' || p.category === filterCategory) &&
        (!q || name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    });
    if (sortBy === 'priceAsc') filtered = [...filtered].sort((a, b) => (overrides[a.id]?.price ?? a.price) - (overrides[b.id]?.price ?? b.price));
    else if (sortBy === 'priceDesc') filtered = [...filtered].sort((a, b) => (overrides[b.id]?.price ?? b.price) - (overrides[a.id]?.price ?? a.price));
    return filtered.map(p => withMeta(p, wishlist, overrides));
  },

  featuredProducts: () => {
    const { wishlist } = get();
    const overrides = useSharedStore.getState().productOverrides;
    return PRODUCTS.slice(0, 4).map(p => withMeta(p, wishlist, overrides));
  },

  selectedProduct: () => {
    const { selectedProductId, wishlist } = get();
    const overrides = useSharedStore.getState().productOverrides;
    const p = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
    return withMeta(p, wishlist, overrides);
  },

  relatedProducts: () => {
    const { selectedProductId, wishlist } = get();
    const overrides = useSharedStore.getState().productOverrides;
    const current = PRODUCTS.find(p => p.id === selectedProductId);
    if (!current) return PRODUCTS.slice(0, 4).map(p => withMeta(p, wishlist, overrides));
    const others = PRODUCTS.filter(p => p.id !== selectedProductId);
    // Score: same category +3, same gender +2, similar price (+1 if within 30%)
    const currentPrice = overrides[current.id]?.price ?? current.price;
    const scored = others.map(p => {
      let score = 0;
      if (p.category === current.category) score += 3;
      if (p.gender === current.gender) score += 2;
      const pPrice = overrides[p.id]?.price ?? p.price;
      if (Math.abs(pPrice - currentPrice) / currentPrice <= 0.3) score += 1;
      return { p, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map(({ p }) => withMeta(p, wishlist, overrides));
  },
    }),
    {
      name: 'tivora-store',
      partialize: (state) => ({ wishlist: state.wishlist }),
    }
  )
);
