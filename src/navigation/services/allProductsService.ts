
interface AllProduct {
	
}

export const fetchAllProduct = async (limit: number = 100, offset: number = 0) => {
	try {
		const response = await fetch(`$(API_BASE_URL)/products?limit=${limit}&offset=${offset}`);
		const json = await response.json()
			return json?.data?.results ?? [];
	
		
	} catch (error) {
		    console.error("Tüm ürünleri çekerken hata:", error);
			return [];

	}
}