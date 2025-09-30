import { API_BASE_URL} from "@env";

 
export interface PriceInfo {
  profit: number | null;
  total_price: number;
  discounted_price: number | null;
  price_per_servings: number | null;
  discount_percentage: number | null;
}


export interface BestSellerProps {
  name: string;
  short_explanation: string;
  slug: string;
  price_info: PriceInfo;
  photo_src: string;
  comment_count: number;
  average_star: number;
}

export const fetchBestSellers = async () :Promise<BestSellerProps[]> => {
const response = await fetch(`${API_BASE_URL}/products/best-sellers`);
if (!response.ok) {
    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
  }
  const json = await response.json() as {
    status: string;
    data: BestSellerProps[];
  } ;
 // Burada yalnızca içteki diziye erişiyoruz
  return json.data;
}