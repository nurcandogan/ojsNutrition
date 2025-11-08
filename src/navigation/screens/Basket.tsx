import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env';
import { useCartStore } from '../../store/cartStore';

const Basket = () => {
  const navigation = useNavigation();
  const { Productitems, increaseQuantity, decreaseQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  // Boyut formatı (250g, 60 tablet gibi)
  const formatSize = (size: { gram: number | null; pieces: number | null; total_services: number | null }) => {
    if (size.gram) {
      return `${size.gram}g`;
    }
    if (size.pieces) {
      return `${size.pieces} tablet`;
    }
    if (size.total_services) {
      return `${size.total_services} servis`;
    }
    return '';
  };

  // Boş sepet görünümü
  if (Productitems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-2xl font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>

        {/* Boş Sepet İçeriği */}
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-base text-gray-600 text-center">
            Sepetinizde Ürün Bulunmamaktadır
          </Text>
        </View>

        {/* Sticky Bottom Bar - Boş Sepet */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold">TOPLAM 0 TL</Text>
            <TouchableOpacity
              className="bg-gray-300 px-6 py-3 rounded flex-row items-center"
              disabled
            >
              <Text className="text-gray-600 font-semibold mr-2">DEVAM ET</Text>
              <Feather name="arrow-right" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-2xl font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>

        {/* Ürün Listesi */}
        <View className="px-5 mt-4">
          {Productitems.map((item) => (
            <View 
              key={item.variantId} 
              className="flex-row pb-4 mb-4 border-b border-gray-100"
            >
              {/* Ürün Resmi */}
              <Image
                source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
                className="w-20 h-20 rounded"
                resizeMode="cover"
              />

              {/* Ürün Bilgileri */}
              <View className="flex-1 ml-4">
                {/* Ürün Adı ve Fiyat - Üst Kısım */}
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1 mr-2">
                    <Text className="text-base font-bold mb-1" numberOfLines={2}>
                      {item.productName.toUpperCase()}
                    </Text>
                    
                    {/* Aroma ve Boyut */}
                    {item.aroma && (
                      <Text className="text-sm text-gray-600 mb-1">
                        {item.aroma}
                      </Text>
                    )}
                    
                    {item.size && (
                      <Text className="text-sm text-gray-600">
                        {formatSize(item.size)}
                      </Text>
                    )}
                  </View>

                  {/* Fiyat */}
                  <View className="items-end">
                    <Text className="text-base font-bold">
                      {Math.round(item.price)} TL
                    </Text>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <Text className="text-xs text-gray-400 line-through">
                        {Math.round(item.oldPrice)} TL
                      </Text>
                    )}
                  </View>
                </View>

                {/* Miktar Kontrolü - Alt Kısım */}
                <View className="flex-row items-center mt-3">
                  {/* Silme Butonu */}
                  <TouchableOpacity
                    onPress={() => removeItem(item.variantId)}
                    className="mr-3"
                  >
                    <Feather name="trash-2" size={18} color="#6b7280" />
                  </TouchableOpacity>

                  {/* Miktar Sayısı */}
                  <Text className="text-base font-semibold min-w-[20px] text-center">
                    {item.quantity}
                  </Text>

                  {/* Artırma Butonu */}
                  <TouchableOpacity
                    onPress={() => increaseQuantity(item.variantId)}
                    className="ml-3"
                  >
                    <Feather name="plus" size={18} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar - Dolu Sepet */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold">
            TOPLAM {Math.round(totalPrice)} TL
          </Text>
          <TouchableOpacity
            className="bg-black px-6 py-3 rounded flex-row items-center"
            onPress={() => {
              // Ödeme sayfasına yönlendirme buraya gelecek
              console.log("Ödeme sayfasına yönlendiriliyor...");
            }}
          >
            <Text className="text-white font-semibold mr-2">DEVAM ET</Text>
            <Feather name="arrow-right" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Basket;
