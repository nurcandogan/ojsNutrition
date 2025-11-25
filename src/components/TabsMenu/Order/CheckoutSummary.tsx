import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import OkInput from '../BizeUlasin/OkInput';

interface CheckoutSummaryProps {
  totalPrice: number;
  shipmentFee: number;
  buttonTitle: string;
  onButtonPress: () => void;
  disabled: boolean;
  extraDetail?: React.ReactNode; 
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  totalPrice,
  shipmentFee,
  buttonTitle,
  onButtonPress,
  disabled,
  extraDetail,
}) => {
  // Hesaplama: Toplam fiyatı bulmak için ekstra detay (Kapıda Ödeme Farkı) değerini manuel olarak varsayıyoruz (30 TL)
  let finalPrice = totalPrice + shipmentFee; 
  if (extraDetail) {
      finalPrice += 30; // Kapıda Ödeme Farkı (Sabit 30 TL varsayılmıştır)
  }

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-6 pt-3 shadow-lg">
      <View className="mx-6">
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-600">Ürün Toplamı:</Text>
          <Text className="text-sm font-semibold">{Math.round(totalPrice)} TL</Text>
        </View>

        <View className="flex-row justify-between mb-3">
          <Text className="text-sm text-gray-600">Kargo Ücreti:</Text>
          <Text className="text-sm font-semibold">{shipmentFee > 0 ? `${shipmentFee} TL` : 'Ücretsiz'}</Text>
        </View>
        
        {extraDetail} 

        <View className="h-[1px] bg-gray-200 my-2" />
        
        <View className="flex-row justify-between mb-4">
          <Text className="text-base font-bold">Ödenecek Toplam:</Text>
          <Text className="text-xl font-bold text-indigo-600">
            {Math.round(finalPrice)} TL
          </Text>
        </View>
      </View>

      <View className="content-center items-center mt-2">
        <OkInput title={buttonTitle} onPress={onButtonPress} disabled={disabled} />
      </View>
    </View>
  );
};

export default CheckoutSummary;