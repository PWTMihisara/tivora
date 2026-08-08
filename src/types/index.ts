export type Gender = 'men' | 'women';
export type Category = 'Outerwear' | 'Knitwear' | 'Tailoring' | 'Accessories';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';
export type SortBy = 'newest' | 'priceAsc' | 'priceDesc';
export type View = 'home' | 'plp' | 'pdp' | 'checkout' | 'confirmation' | 'collections' | 'account' | 'faq' | 'tracking';
export type HomeVariant = 1 | 2 | 3;

export interface Product {
  id: string;
  name: string;
  category: Category;
  gender: Gender;
  price: number;
  images?: string[];   // paths relative to /public, e.g. ['/products/p1-1.jpg', ...]
  priceLabel?: string;
  categoryLabel?: string;
  wished?: boolean;
}

export interface CartLine {
  id: string;
  name: string;
  price: number;
  size: Size;
  qty: number;
  priceLabel?: string;
  lineTotalLabel?: string;
}

export interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}
