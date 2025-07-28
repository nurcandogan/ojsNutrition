const baseUrl = "https://fe1111.projects.academy.onlyjs.com/api/v1";

export type Category = {
  title: string;
  image: unknown;
  id: number;
  name: string;

 
};


export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${baseUrl}/categories`);
    const data = await response.json();
    console.log("API data:", data);
    return data?.data?.data ?? [];                   // Veriyi return ediyoruz
  } catch (error) {
    console.error("Kategori API hatası:", error);
    return []; // Hata durumunda boş array döner
  }
}

