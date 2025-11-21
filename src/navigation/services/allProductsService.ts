import { API_BASE_URL } from "@env";

export interface AllProduct {
  id: string;
  name: string;
  short_explanation?: string;
  slug: string;
  comment_count: number;
  average_star: number;
  photo_src: string;
  price_info: {
    profit?: number | null;
    total_price: number;
    discounted_price: number | null;
    discount_percentage: number | null;
  };
}

export const fetchAllProduct = async (limit: number = 100, offset: number = 0):Promise<AllProduct[]> => {
	try {
		const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&offset=${offset}`);
		const json = await response.json()
			return json?.data?.results ?? [];
	
		
	} catch (error) {
		    console.error("Tüm ürünleri çekerken hata:", error);
			return [];

	}
}