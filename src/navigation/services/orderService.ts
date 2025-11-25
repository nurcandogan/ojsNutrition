import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

/** Sipariş detayını backend'den çeker (GET isteği) */
export async function fetchOrderDetail(orderId: string): Promise<OrderDetail | null> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return null;

    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { 
        headers: { "Authorization": `Bearer ${token}` },
    });
    const json = await res.json();
    
    if (json?.status === 'success' && json?.data) {
      return json.data as OrderDetail;
    }
    return null;
  } catch (e) {
    console.error('Sipariş detayı çekme hatası:', e);
    return null;
  }
}

/** Sipariş oluşturur (Backend'e sadece adres ve ödeme bilgisi gönderir) */
export async function createOrder(addressId: string, paymentType: 'credit_cart' | 'cash_on_delivery', cardDetails?: any): Promise<{ success: boolean, orderNo: string | null, message: string }> {
  try {
    const token = await AsyncStorage.getItem("access_token");
    if (!token) return { success: false, orderNo: null, message: "Oturum bulunamadı" };

    const orderBody = {
      address_id: addressId,
      payment_type: paymentType,
      ...(paymentType === 'credit_cart' && cardDetails ? {
        card_digits: cardDetails.cardNumber,
        card_expiration_date: cardDetails.cardExpire,
        card_security_code: cardDetails.cardCvc,
        card_type: cardDetails.cardType || "VISA", 
      } : {}),
    };

    const response = await fetch(`${API_BASE_URL}/orders/complete-shopping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(orderBody),
    });

    const json = await response.json();
    
    if (response.ok && json.status === 'success' && json.data.order_no) {
      return { success: true, orderNo: json.data.order_no, message: "Siparişiniz başarıyla alındı" };
    } else {
      const errorMessage = json.message || (json.reason ? Object.values(json.reason).flat().join("\n") : "Sipariş oluşturulamadı.");
      return { success: false, orderNo: null, message: errorMessage };
    }
  } catch (error) {
    console.error("Sipariş oluşturma genel hatası:", error);
    return { success: false, orderNo: null, message: "Bir sorun oluştu" };
  }
}