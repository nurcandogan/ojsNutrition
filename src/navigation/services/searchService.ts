import { API_BASE_URL } from "@env";

export const searchProducts = async (keyword: string) => {
  if (!keyword.trim()) return [];

  try {
    const res = await fetch(
      `${API_BASE_URL}/products?search=${keyword}&limit=20&offset=0`
    );
    const json = await res.json();
    return json?.data?.results ?? [];
  } catch (err) {
    console.log("Search Hatası:", err);
    return [];
  }
};



// backendden arama yapıp ürünleri getiriyor fakat ürünün boyut bilgisi backendden gelmiyor.