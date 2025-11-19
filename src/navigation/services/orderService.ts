import { API_BASE_URL } from "@env";

interface ProductVariantDetail {
    size: {
        gram: number;
        pieces: number;
        total_services: number;
    };
    aroma: string;
    photo_src: string;
}

export interface ShoppingCartItem {
    product_id: string;
    product_slug: string;
    product_variant_id: string;
    product: string;
    product_variant_detail: ProductVariantDetail;
    pieces: number;
    unit_price: number;
    total_price: number;
}

export interface Address {
    title: string;
    country: string;
    region: string;
    subregion: string;
    full_address: string;
    phone_number: string;
}

export interface PaymentDetail {
    card_digits: string;
    card_expiration_date: string;
    card_security_code: string;
    payment_type: 'credit_cart' | 'debit_card';
    card_type: 'VISA' | 'MASTERCARD';
    base_price: number;
    shipment_fee: number;
    payment_fee: number;
    discount_ratio: number;
    discount_amount: number;
    final_price: number;
}

export interface ShoppingCart {
    total_price: number;
    items: ShoppingCartItem[];
}

export interface OrderDetails {
    order_no: string;
    order_status: 'in_cargo' | 'delivered' | 'preparing' | string;
    shipment_tracking_number: string;
    address: Address;
    payment_detail: PaymentDetail;
    shopping_cart: ShoppingCart;
}

interface ApiResponse {
    status: string;
    data: OrderDetails;
}


/**
 * Sipariş detaylarını API'den getiren asenkron fonksiyon.
 * @param {string} orderId - Getirilecek siparişin ID'si.
 * @returns {Promise<OrderDetails>} - API'den dönen sipariş verisi.
 */
export async function fetchOrderDetails(orderId: string): Promise<OrderDetails> {
    const url = `${API_BASE_URL}/orders/${orderId}`;
    
    try {
        console.log(`API isteği başlatılıyor: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Hatası ${response.status}: ${errorText || 'Sunucu hatası.'}`);
        }
        
        const apiResponse: ApiResponse = await response.json();
        
        return apiResponse.data;

    } catch (error) {
        console.error("API çağrısı başarısız:", error);
        throw new Error(`Veri çekme hatası: ${error instanceof Error ? error.message : 'Bilinmeyen Hata'}`);
    }
}