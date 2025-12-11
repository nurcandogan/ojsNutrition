import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';


 // Ürünü Backend Sepetine Ekler

export async function addToCartService(productId: string, variantId: string, quantity: number): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) {
      
        console.log("Token yok, sepete eklenemedi.");
        return false;
    }

    //  DÜZELTME: Backend'in istediği format (Hata loguna göre)
    const body = JSON.stringify({
        product_id: productId,          // "This field is required" hatası için eklendi
        product_variant_id: variantId,
        pieces: quantity                // "quantity" yerine "pieces" yazıldı
    });

    console.log(" Backend Sepete Gönderilen Body:", body);

    const response = await fetch(`${API_BASE_URL}/users/cart`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: body
    });

    const json = await response.json();
    
    if (response.ok) { // Veya json.status === 'success'
        console.log(" Ürün Başarıyla Backend Sepetine Eklendi");
        return true;
    } else {
        console.error(" Sepete ekleme hatası (API):", json);
        return false;
    }

  } catch (error) {
    console.error("Sepet servisi hatası:", error);
    return false;
  }
}


// Sepeti Backend'den Temizler
export async function clearRemoteCart(): Promise<boolean> {
    try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return false;
        const response = await fetch(`${API_BASE_URL}/users/cart`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log("clearRemoteCart → status:", response.status, "body:", response);

        return response.ok;
        
    } catch (e) {
        return false;
    }
}
