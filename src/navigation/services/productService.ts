// services/productService.ts
import { API_BASE_URL } from '@env';

export type Variant = {
  id: string;
  aroma: string | null;
  is_available: boolean;
  photo_src: string;
  size: {
    pieces: number | null;        // gram/adet vs. API ne gönderiyorsa
    total_services: number | null;
  };
  price: {
    profit: number | null;
    total_price: number;
    discounted_price: number | null;
    price_per_servings: number | null;
    discount_percentage: number | null;
  };
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  short_explanation?: string;
  explanation?: {
    usage?: string;
    features?: string;
    description?: string;
    nutritional_content?: {
      ingredients?: { aroma: string | null; value: string }[];
      nutrition_facts?: {
        ingredients?: { name: string; amounts: string[] }[];
        portion_sizes?: string[];
      } | null;
      amino_acid_facts?: any;
    };
  };
  main_category_id?: string;
  tags?: string[];
  variants: Variant[];
  comment_count: number;
  average_star: number;
};

export async function fetchProductDetail(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);
    const json = await res.json();
    return json?.data ?? null;
  } catch (e) {
    console.error('Ürün detayı hatası:', e);
    return null;
  }
}
