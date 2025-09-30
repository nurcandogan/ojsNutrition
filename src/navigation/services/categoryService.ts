import { API_BASE_URL } from '@env';


export type Category = {
  id: string;           // API'de string olarak geliyor
  name: string;
  slug: string;
  order: number;
  children?: any[];     // İleride kullanıcaz
  top_sellers?: any[];  // İleride kullanıcaz

 
};


export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    //console.log("API data:", data);
    return data?.data?.data ?? [];                //En içteki listeyi al, ama herhangi bir aşamada veri yoksa bana boş array ver
  } catch (error) {
    console.error("Kategori API hatası:", error);
    return []; // Hata durumunda boş array döner
  }
}

