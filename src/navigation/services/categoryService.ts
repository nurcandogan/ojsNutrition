const baseUrl = "https://fe1111.projects.academy.onlyjs.com/api/v1";

export type Category = {
  id: number;
  name: string;
  
 
};

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${baseUrl}/categories`);
    if (!res.ok) {
      throw new Error("Kategori API hatası");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
