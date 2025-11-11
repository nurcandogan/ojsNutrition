import { create } from 'zustand';
import { Variant } from '../navigation/services/productService';

// Sepet ürünü tipi
export interface CartItem {
  // Ürün bilgileri
  productId: string;
  productName: string;
  slug: string;
  photo_src: string;
  // Variant bilgileri
  variantId: string;
  aroma: string | null;
  size: {
    gram: number | null;
    pieces: number | null;
    total_services: number | null;
  };
  
  // Fiyat bilgileri
  price: number; // discounted_price varsa o, yoksa total_price
  oldPrice: number | null; // total_price eğer indirim varsa
  discountPercentage: number | null;
  
  // Miktar
  quantity: number;
}



type AddItemPayload = {
  productId: string;
  productName: string;
  slug: string;
  photo_src: string;
  variant: Variant;
};


interface CartState {
   ProductItems: CartItem[];
   addItem: (product:AddItemPayload ) => void;             // Sepete ürün ekleme
  increaseQuantity: (variantId: string) => void;            // Miktar artırma
  decreaseQuantity: (variantId: string) => void;               // Miktar azaltma
  removeItem: (variantId: string) => void;                       // Ürün silme
  clearCart: () => void;                                   // Sepeti temizleme
  getTotalPrice: () => number;                             // Toplam fiyat
  getTotalItems: () => number;                                // Toplam ürün sayısı
  setItemsFromBackend: (items: CartItem[]) => void;            // Backend'den sepete ürün ekleme (gelecekte kullanılacak)

}

export const useCartStore = create<CartState>((set, get) => ({
    ProductItems: [],
  
  addItem: (product) => {
    const { ProductItems } = get();
    const { productId, productName, slug, photo_src, variant } = product;
    
    // Aynı variant zaten sepette var mı kontrol et
    const existingItem = ProductItems.find(item => item.variantId === variant.id);
    
    if (existingItem) {
      // Varsa miktarı artır
      set({
        ProductItems: ProductItems.map(item =>
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      // Yoksa yeni ürün ekle
      const price = variant.price.discounted_price ?? variant.price.total_price;
      const oldPrice = variant.price.discount_percentage 
        ? variant.price.total_price 
        : null;
      
      const newItem: CartItem = {
        productId,
        productName,
        slug,
        photo_src: variant.photo_src || photo_src,
        variantId: variant.id,
        aroma: variant.aroma,
        size: variant.size,
        price,
        oldPrice,
        discountPercentage: variant.price.discount_percentage,
        quantity: 1,    //sepete bı tan eklendı dıyoruz. yenı kart olusturdugumuz ıcın bu kısımda 1 tane vardı demek ıstıyoruz..
      };
      
      set({ ProductItems: [...ProductItems, newItem] });
    }
  },
  
  increaseQuantity: (variantId) => {
    set({
      ProductItems: get().ProductItems.map(item =>
        item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    });
  },
  
  decreaseQuantity: (variantId) => {
    set({
      ProductItems: get().ProductItems.map(item =>
        item.variantId === variantId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ),
    });
  },
  
  removeItem: (variantId) => {
    set({
      ProductItems: get().ProductItems.filter(item => item.variantId !== variantId),
    });
  },
  
  clearCart: () => {
    set({ ProductItems: [] });
  },
  
  getTotalPrice: () => {
    return get().ProductItems.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  
  getTotalItems: () => {
    return get().ProductItems.reduce((total, item) => total + item.quantity, 0);
  },
  
  setItemsFromBackend: (items) => {
    set({ ProductItems: items });
  },
}));

