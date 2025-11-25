// src/components/OrderSummaryCollapse.tsx (GÜNCELLENMİŞ SON HALİ)

import { View, Text, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env'; 
import { useCartStore } from '../../../store/cartStore';

// LayoutAnimation'ı Android'de aktif etme kodu (Cross-platform uyumluluk için tutulmuştur)
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface OrderSummaryCollapseProps {
    totalAmount: number; // Kargo/ödeme farkı hariç ürün toplamı
    itemCount: number;
    paymentFee: number; // Kapıda ödeme farkı (Örn: 39 TL)
    shipmentFee: number; // Kargo ücreti (Örn: 20 TL)
}

const OrderSummaryCollapse: React.FC<OrderSummaryCollapseProps> = ({ 
    totalAmount, 
    itemCount,
    paymentFee,
    shipmentFee
}) => {
  const { ProductItems } = useCartStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const finalPrice = totalAmount + shipmentFee + paymentFee;

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };
  
  const formatSize = (size: { gram: number | null; pieces: number | null; total_services: number | null; }) => {
    if (size?.gram) return `${size.gram}g`;
    if (size?.pieces) return `${size.pieces} tablet`;
    if (size?.total_services) return `${size.total_services} servis`;
    return '';
  };

  return (
    <View className="bg-white border-b border-gray-200">
      <TouchableOpacity 
        onPress={toggleExpand}
        // Görsel 6'daki başlık stili
        className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200" 
      >
        {/* Başlık: Özet ve Toplam Fiyat */}
        <Text className="text-xl font-bold">Özet: {Math.round(finalPrice)} TL ({itemCount} ürün)</Text>
        
        {/* Ok İkonu */}
        <Feather 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#4F46E5"
        />
      </TouchableOpacity>

      {/* İçerik (Açılır/Kapanır Bölüm) */}
      {isExpanded && (
        <View className="p-5">
          {/* Ürün Listesi */}
          {ProductItems.map((item, index) => (
            <View key={item.variantId} className="flex-row justify-between items-start mb-4">
              
              <View className="flex-row flex-1 pr-3 items-center">
                 <Text className="text-lg font-bold mr-2 text-indigo-600">{item.quantity}</Text>
                 <Image
                    source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
                    className="w-12 h-12 mr-3 rounded-md"
                    resizeMode="cover"
                 />
                 <View className="flex-1">
                    <Text className="text-base font-bold" numberOfLines={1}>{item.productName?.toUpperCase()}</Text>
                    <Text className="text-sm text-gray-600">
                       {item.aroma ? item.aroma + ' / ' : ''}
                       {formatSize(item.size)}
                    </Text>
                 </View>
              </View>

              <Text className="text-base font-semibold">{Math.round(item.price * item.quantity)} TL</Text>
            </View>
          ))}
          
          <View className="h-[1px] bg-gray-200 my-4" />

          {/* Fiyat Detayları (Görsel 6'daki Özet kısmı) */}
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-700">Ara Toplam</Text>
              <Text className="text-base font-semibold">{Math.round(totalAmount)} TL</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base text-gray-700">Teslimat / Kargo</Text>
              <Text className="text-base font-semibold">{shipmentFee > 0 ? `${shipmentFee} TL` : 'Ücretsiz'}</Text>
            </View>
            {paymentFee > 0 && (
                <View className="flex-row justify-between">
                    <Text className="text-base text-gray-700">Kapıda Ödeme Farkı</Text>
                    <Text className="text-base font-semibold text-red-500">{paymentFee} TL</Text>
                </View>
            )}
            
            <View className="flex-row justify-between pt-2 mt-2 border-t border-gray-300">
              <Text className="text-xl font-bold">TOPLAM</Text>
              <Text className="text-xl font-bold text-indigo-600">{Math.round(finalPrice)} TL</Text>
            </View>
            
          </View>
          
        </View>
      )}
    </View>
  );
};

export default OrderSummaryCollapse;