import { View, Text, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
// Not: Bu bileşen, ProductItems'ı çağırmak için useCartStore'a bağımlıdır.
import { useCartStore } from '../../../store/cartStore'; 
// Not: MEDIA_BASE_URL'ın @env dosyanızdan geldiği varsayılmıştır.
import { MEDIA_BASE_URL } from '@env'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface OrderSummaryCollapseProps {
    totalAmount: number; // Ürünlerin toplam fiyatı
    itemCount: number;
    paymentFee: number; 
    shipmentFee: number; 
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
        className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200" 
      >
        {/* Başlık: Solda Özet, Sağda Tutar */}
        <Text className="text-xl font-bold">Özet: {Math.round(finalPrice)} TL ({itemCount} ürün)</Text>
        
        {/* Ok İkonu */}
        <Feather 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#4F46E5"
        />
      </TouchableOpacity>

      {/* İçerik (Açılır/Kapanır Bölüm - Özet Detayları) */}
      {isExpanded && (
        <View className="p-5">
          {/* Ürün Listesi */}
          <Text className="text-base font-semibold mb-3">Sepet İçeriği:</Text>
          {ProductItems.map((item, index) => (
            <View key={item.variantId} className="flex-row justify-between items-center mb-2">
                 <Text className="text-sm flex-1 pr-3">{item.productName} ({item.quantity} adet)</Text>
                 <Text className="text-sm font-semibold">{Math.round(item.price * item.quantity)} TL</Text>
            </View>
          ))}
          
          <View className="h-[1px] bg-gray-200 my-4" />

          {/* Fiyat Detayları */}
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