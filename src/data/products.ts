import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  { id: 'p1',  name: 'Wool Overcoat',        category: 'Outerwear',   gender: 'men',   price: 1280, images: [] },
  { id: 'p2',  name: 'Cashmere Sweater',      category: 'Knitwear',    gender: 'women', price: 640,  images: [] },
  { id: 'p3',  name: 'Tailored Blazer',       category: 'Tailoring',   gender: 'men',   price: 980,  images: [] },
  { id: 'p4',  name: 'Silk Slip Dress',       category: 'Tailoring',   gender: 'women', price: 720,  images: [] },
  { id: 'p5',  name: 'Leather Belt',          category: 'Accessories', gender: 'men',   price: 310,  images: [] },
  { id: 'p6',  name: 'Structured Tote',       category: 'Accessories', gender: 'women', price: 890,  images: [] },
  { id: 'p7',  name: 'Merino Turtleneck',     category: 'Knitwear',    gender: 'men',   price: 420,  images: [] },
  { id: 'p8',  name: 'Wide-Leg Trouser',      category: 'Tailoring',   gender: 'women', price: 560,  images: [] },
  { id: 'p9',  name: 'Quilted Field Jacket',  category: 'Outerwear',   gender: 'women', price: 1050, images: [] },
  { id: 'p10', name: 'Cotton Poplin Shirt',   category: 'Tailoring',   gender: 'men',   price: 340,  images: [] },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;
export const CATEGORIES = ['Outerwear', 'Knitwear', 'Tailoring', 'Accessories'] as const;

export const PRODUCT_DESC = 'A considered piece cut from premium materials, finished by hand for a silhouette built to outlast the season.';

export const money = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
