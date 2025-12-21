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


export async function getRemoteCart(): Promise<any> {
    try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return null;

        const response = await fetch(`${API_BASE_URL}/users/cart`, {
            method: 'GET',
            headers: { "Authorization": `Bearer ${token}` }
        });

        const json = await response.json();
        // API'den dönen verinin içinde data var mı kontrol et
        return json?.data || null; 
    } catch (error) {
        return null;
    }
}

      // 3. SİLME: Ürünü Backend Sepetinden Kaldırır
export async function removeFromRemoteCart(item: any): Promise<boolean> {
    try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return false;

        // 1. ID KONTROLÜ: Veri hem yerel store'dan hem API'den gelebilir.
        // Yerel store'da 'productId', API'de 'product_id' olabilir. İkisini de kontrol et.
        const pId = item.product_id || item.productId;
        const vId = item.product_variant_id || item.variantId;
        const pcs = item.pieces || item.quantity || 1;

        if (!pId || !vId) {
            console.error(" Silme Hatası: ID bulunamadı!", item); 
            return false;
        }

        const bodyData = JSON.stringify({
            product_id: pId,              
            product_variant_id: vId, 
            pieces: pcs                       
        });

        console.log(" Sunucudan Siliniyor (Body):", bodyData);

        const response = await fetch(`${API_BASE_URL}/users/cart`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: bodyData 
        });

        // Backend bazen 200, 202 veya 204 dönebilir
        return response.ok; 

    } catch (error) {
        console.error(" Ürün silme hatası:", error);
        return false;
    }
}


// 4. TEMİZLEME, Hepsini tek tek bulup siler

export async function clearRemoteCart(): Promise<boolean> {
    try {
        const token = await AsyncStorage.getItem("access_token");
        if (!token) return false;

        console.log("🧹 Backend sepeti temizleniyor...");

        // ADIM 1: Sepeti getir
        const cartData = await getRemoteCart();
        
        // Sepet zaten boşsa uğraşma
        if (!cartData || !cartData.items || cartData.items.length === 0) {
            console.log(" Backend sepeti zaten boş.");
            return true;
        }

        // ADIM 2: Listedeki her ürünü tek tek sil
        for (const item of cartData.items) {
            await removeFromRemoteCart(item);
        }

        console.log(" Tüm ürünler başarıyla temizlendi.");
        return true;
        
    } catch (e) {
        console.error("Temizleme hatası:", e);
        return false;
    }
}


//mmkv from 'src/storage/mmkv';