import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from '../../store/cartStore'; 

export interface OrderDetail {
    order_no: string;
    order_status: string;
    shipment_tracking_number: string | null;
    address: {
        title: string;
        country: string;
        region: string;
        subregion: string;
        full_address: string;
        phone_number: string;
    };
    payment_detail: {
        card_digits: string;
        card_expiration_date: string;
        card_security_code: string;
        payment_type: string;
        card_type: string;
        base_price: number;
        shipment_fee: number;
        payment_fee: number;
        discount_ratio: number;
        discount_amount: number;
        final_price: number;
    };
    shopping_cart: {
        total_price: number;
        items: Array<{
            product_id: string;
            product_slug: string;
            product_variant_id: string;
            product: string;
            product_variant_detail: {
                size: { gram: number | null; pieces: number | null; total_services: number | null; };
                aroma: string | null;
                photo_src: string;
            };
            pieces: number;
            unit_price: number;
            total_price: number;
        }>;
    };
}

export async function fetchOrderDetail(orderId: string): Promise<OrderDetail | null> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return null;
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { 
        headers: { "Authorization": `Bearer ${token}` },
    });
    const json = await res.json();
    if (json?.status === 'success' && json?.data) return json.data as OrderDetail;
    return null;
  } catch (e) {
    return null;
  }
}

// YARDIMCI FONKSİYON: Siparişten önce sepeti sunucuyla eşitle
// Sunucu "sepet boş" demesin diye ürünleri tek tek sunucuya gönderiyoruz.
async function syncCartWithBackend(token: string, items: any[]) {
    console.log("🔄 Sepet Sunucuyla Eşitleniyor...");
    const ADD_TO_CART_URL = `${API_BASE_URL}/users/cart`; 

    for (const item of items) {
        try {
            // Backend'in "Sepete Ekle" endpoint'inin istediği format:
            // product_id, product_variant_id, pieces
            const body = JSON.stringify({
                product_id: item.productId, 
                product_variant_id: item.variantId,
                pieces: item.quantity 
            });

            await fetch(ADD_TO_CART_URL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: body
            });
        } catch (error) {
            console.error("Sync hatası:", error);
        }
    }
    console.log("✅ Sepet Eşitlendi.");
}

/** Sipariş oluşturur */
export async function createOrder(addressId: string, paymentType: string, cardDetails?: any): Promise<{ success: boolean, orderNo: string | null, message: string }> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return { success: false, orderNo: null, message: "Oturum bulunamadı" };

    const cartItems = useCartStore.getState().ProductItems;
    if (!cartItems || cartItems.length === 0) {
        return { success: false, orderNo: null, message: "Sepetiniz boş." };
    }

    //  ADIM 1: Önce Sepeti Sunucuya Gönder (GARANTİLEMEK İÇİN)
    await syncCartWithBackend(token, cartItems);

    //  ADIM 2: Ödeme Tipini Çevir
    let backendPaymentType = '';
    if (paymentType === 'credit_card_form') {
        backendPaymentType = 'credit_cart'; 
    } 
    else if (paymentType === 'cash_on_delivery_cash') {
        backendPaymentType = 'cash_at_door'; 
    }
    else if (paymentType === 'cash_on_delivery_card') {
        backendPaymentType = 'credit_cart_at_door'; 
    }
    else {
        backendPaymentType = paymentType;
    }

    // ADIM 3: Siparişi Tamamla
    // Not: itemsPayload göndermemize gerek kalmadı çünkü yukarıda sync yaptık,
    // ama yine de dursun, zararı yok.
    const itemsPayload = cartItems.map(item => ({
        product_variant_id: item.variantId,
        pieces: item.quantity
    }));

    const orderBody = {
      address_id: addressId,
      payment_type: backendPaymentType,
      items: itemsPayload,
      
      ...(backendPaymentType === 'credit_cart' && cardDetails ? {
        card_digits: cardDetails.cardNumber,
        card_expiration_date: cardDetails.cardExpire,
        card_security_code: cardDetails.cardCvc,
        card_type: "VISA", 
        card_holder: cardDetails.cardHolder
      } : {}),
    };

    console.log("Backend'e Giden Body:", JSON.stringify(orderBody));

    const response = await fetch(`${API_BASE_URL}/orders/complete-shopping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderBody),
    });

    const json = await response.json();
    console.log("Backend Cevabı:", json);
    
    if (response.ok && json.status === 'success' && json.data.order_no) {
      return { success: true, orderNo: json.data.order_no, message: "Siparişiniz başarıyla alındı" };
    } else {
      let errorMessage = "Sipariş oluşturulamadı.";
      if (json.message) errorMessage = json.message;
      else if (json.reason) errorMessage = JSON.stringify(json.reason);
      return { success: false, orderNo: null, message: errorMessage };
    }
  } catch (error) {
    console.error("Sipariş hatası:", error);
    return { success: false, orderNo: null, message: "Bir sorun oluştu" };
  }
}