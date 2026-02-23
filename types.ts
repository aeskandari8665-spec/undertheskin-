export enum Timing {
  Morning = 'صبح (ناشتا)',
  Breakfast = 'همراه صبحانه',
  BeforeMeal = 'قبل از غذا',
  WithFood = 'همراه غذا',
  Evening = 'عصر',
  Night = 'شب (قبل از خواب)',
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  dosage: string;
  timing: Timing;
  price: number;
  duration: string;
  imageColor: string;
  category: 'beauty' | 'health' | 'vitality';
  rating: number;
  reviews: number;
  stock: number;
  expirationDate: string;
  points: number; // New loyalty points property
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ViewState = 'home' | 'products' | 'routine' | 'assistant' | 'ai-routine';