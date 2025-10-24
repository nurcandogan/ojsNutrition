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
  results: CommentItem[];
};

export const getProductComments = async (slug:string, limit?:number, offset?:number):Promise<CommentsPage> => {
    const url = await fetch(`${API_BASE_URL}/products/:${slug}/comments?limit=${limit}&offset=${offset}`);
    const response = await url.json();
    
   
     const data = response?.data ?? response;

    return {
    count: data?.count ?? 0,
    results: (data.results ?? []).map((data: any) => ({
      ...data,
      stars: Math.max(1, Math.min(5, Number(data.stars))), // normalize
    })),
  };
  
}


