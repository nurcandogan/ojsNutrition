import { View, Text, TouchableOpacity, Image, LayoutAnimation } from 'react-native';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useCartStore } from '../../../store/cartStore'; 
import { MEDIA_BASE_URL } from '@env'; 



interface OrderSummaryCollapseProps {
    totalAmount: number;
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
    // z-50 ile en üstte kalmasını sağlıyoruz
    <View className="relative z-50 bg-white border-b border-gray-200">
      
      {/* --- BAŞLIK (HEADER) --- */}
      <TouchableOpacity 
        onPress={toggleExpand}
        activeOpacity={0.9}
        className="flex-row justify-between items-center px-5 py-4 bg-white z-50 relative"
      >
        <Text className="text-lg font-bold text-black">Özet</Text>
        
        <View className="flex-row items-center">
            <Text className="text-lg font-bold text-black mr-2">
                {Math.round(finalPrice)} TL ({itemCount} ürün)
            </Text>
            <Feather 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#000"
            />
        </View>
      </TouchableOpacity>

      {/* --- AÇILIR MENÜ (TOP SHEET / DROPDOWN) --- */}
      {isExpanded && (
        <View className="absolute top-[100%] left-0 right-0 bg-white px-5 pb-6 pt-5 shadow-xl border-b border-gray-200 rounded-b-2xl z-40">
          
          {/* Ürün Listesi */}
          {ProductItems.map((item) => (
            <View key={item.variantId} className="flex-row justify-between items-start mb-6">
                 
                 <View className="flex-row flex-1 pr-3">
                    
                    {/* RESİM VE ROZET ALANI */}
                    <View className="relative mr-4">
                        {/* Ürün Resmi */}
                        <Image
                            source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
                            className="w-16 h-16 rounded-md bg-gray-100 border border-gray-200"
                            resizeMode="cover"
                        />
                        
                        {/* Miktar Rozeti (Sağ Üst Köşe - Absolute) */}
                        <View className="absolute -top-2 -right-2 bg-gray-600 rounded-full h-6 w-6 justify-center items-center z-10 border border-white">
                            <Text className="text-white text-xs font-bold">{item.quantity}</Text>
                        </View>
                    </View>

                    {/* Ürün Bilgileri */}
                    <View className="flex-1 justify-center space-y-1">
                        <Text className="text-sm font-bold text-black" numberOfLines={2}>
                            {item.productName?.toUpperCase()}
                        </Text>
                        <Text className="text-xs text-gray-500">
                           {item.aroma ? item.aroma + ' / ' : ''}
                           {formatSize(item.size)}
                        </Text>
                    </View>
                 </View>

                 {/* Fiyat */}
                 <Text className="text-sm font-bold text-black mt-1">
                    {Math.round(item.price * item.quantity)} TL
                 </Text>
            </View>
          ))}
          
          <View className="h-[1px] bg-gray-200 mb-4" />

          {/* İndirim Kodu Ekle */}
          <TouchableOpacity className="mb-4">
             <Text className="text-gray-500 text-sm">İndirim kodu ekle</Text>
          </TouchableOpacity>

          <View className="h-[1px] bg-gray-200 mb-4" />

          {/* Fiyat Detayları */}
          <View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-[15px]">Ara Toplam</Text>
              <Text className="font-bold text-[15px] text-black">{Math.round(totalAmount)} TL</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600 text-[15px]">Teslimat / Kargo</Text>
              <Text className="font-bold text-[15px] text-black">{shipmentFee > 0 ? `${shipmentFee} TL` : 'Ücretsiz'}</Text>
            </View>
            
            {paymentFee > 0 && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600 text-[15px]">Kapıda Ödeme Farkı</Text>
                    <Text className="font-bold text-[15px] text-red-500">{paymentFee} TL</Text>
                </View>
            )}
            
            <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-200">
              <Text className="text-lg font-bold text-indigo-700">TOPLAM</Text>
              <Text className="text-lg font-bold text-indigo-700">{Math.round(finalPrice)} TL</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrderSummaryCollapse;