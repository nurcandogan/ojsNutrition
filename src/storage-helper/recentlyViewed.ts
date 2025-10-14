import AsyncStorage from '@react-native-async-storage/async-storage';

export type MiniProduct = {
  slug: string;
  name: string;
  photo_src: string;
  price: number;
};

const KEY = 'recentlyViewed_v1';
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
