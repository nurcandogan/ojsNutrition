import { API_BASE_URL } from '@env';

export type CommentItem = {
  stars: number;                // API '5' (string) döndürebilir; number'a çeviriyoruz
  comment: string;
  title: string;
  created_at: string;
  aroma: string | null;
  first_name?: string;
  last_name?: string;
};

export type CommentsPage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: CommentItem[];
};

export const ProductComments = async (slug:string, limit:10, offset:0):Promise<CommentsPage> => {
    const url = await fetch(`${API_BASE_URL}/products/:${slug}/comments?limit=${limit}&offset=${offset}`);
    const response = await url.json();
    
   
     if (response?.status !== 'success' || !response?.data) {
    return { count: 0, next: null, previous: null, results: [] };
  }

    const d = response.data as CommentsPage & {results: Array<any> };

    return {
    count: d.count ?? 0,
    next: d.next ?? null,
    previous: d.previous ?? null,
    results: (d.results ?? []).map((r) => ({
      ...r,
      stars: Math.max(1, Math.min(5, Number(r.stars))), // normalize
    })),
  };

}


// ReviewSummary için yardımcılar
export function buildDistribution(items: CommentItem[]): number[] {
  // 5,4,3,2,1 sırası
  const dist = [0, 0, 0, 0, 0];
  for (const c of items) {
    const idx = 5 - Math.round(c.stars);
    if (idx >= 0 && idx <= 4) dist[idx] += 1;
  }
  return dist;
}

export function calcAverage(items: CommentItem[]): number {
  if (!items.length) return 0;
  const sum = items.reduce((a, b) => a + b.stars, 0);
  return sum / items.length;
}
