import AsyncStorage from '@react-native-async-storage/async-storage';

export type MiniProduct = {
  id:string;
  slug: string;
  name: string;
  short_explanation?: string;
  photo_src: string;
  comment_count: number;
  average_star: number;
  price_info: {
     profit?:number | undefined;
     total_price:number; 
     discounted_price: number | null;
     discount_percentage: number | null;
  
  };
};

const KEY = 'recentlyViewed_v3';
const LIMIT = 8;

export async function addRecentlyViewed(p: MiniProduct) {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const arr: MiniProduct[] = raw ? JSON.parse(raw) : [];
    
    // aynı ürünü başa al
    const without = arr.filter(x => x.slug !== p.slug);
    const next = [p, ...without].slice(0, LIMIT);
    
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export async function getRecentlyViewed(): Promise<MiniProduct[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}