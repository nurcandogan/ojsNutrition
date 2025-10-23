import { API_BASE_URL } from '@env';

export type FactItem = {
  name: string;           
  amounts: string[];    
};

export type NutritionFacts = {
  ingredients: FactItem[];    // besin maddeleri listesi
  portion_sizes: string[];   
};

export type NutritionalContent = {
  // aroma'ya göre değişen içerik listesi
  ingredients: {
    aroma: string | null;    
    value: string;         
  }[];
  nutrition_facts: NutritionFacts | null;
  amino_acid_facts: NutritionFacts | null; 
};

export type Explanation = {
  usage: string;             
  features: string;          
  description: string;        
  nutritional_content: NutritionalContent;
};

export type Variant = {
  size_label: any;
  id: string;
  size: {
    gram: number | null;         
    pieces: number | null;        
    total_services: number | null;
  };
  aroma: string | null;        
  price: {
    profit: number | null;
    total_price: number;          
    discounted_price: number | null;    
    discount_percentage: number | null; 
     price_per_servings: number | null;
  };
  photo_src: string;            
  is_available: boolean;
};

export type ProductDetailProps = {
  price_per_servings: null;
  photo_src: string;
  id: string;                     
  name: string;                   
  slug: string;                  
  short_explanation: string;      
  explanation: Explanation;       
  main_category_id: string;      
  sub_category_id: string | null; 
  tags: string[];                
  variants: Variant[];            
  comment_count: number;        
  average_star: number;          
};

/** /products/:slug -> tek ürün döner */
export async function fetchProductDetail(slug: string): Promise<ProductDetailProps | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${slug}`);
    const json = await res.json();
    console.log('Ürün detayı:', json);
    if (json?.status === 'success' && json?.data) {
      return json.data as ProductDetailProps;
    }
    return null;
  } catch (e) {
    console.error('Ürün detayı hatası:', e);
    return null;
  }
}
