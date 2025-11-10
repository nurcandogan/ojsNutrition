import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env';
import { useCartStore } from '../../store/cartStore';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput';

const Basket = () => {
  const navigation = useNavigation();
  const { ProductItems, increaseQuantity, decreaseQuantity, removeItem, getTotalPrice } = useCartStore();
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
  if (ProductItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-[17.66px] font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>

        {/* Boş Sepet İçeriği */}
        <View className="mt-2 items-center justify-center px-6">
          <Text className="text-[13.5px] text-black text-center">
            Sepetinizde Ürün Bulunmamaktadır
          </Text>
        </View>

        {/* Sticky Bottom Bar - Boş Sepet */}
        <View className='absolute bottom-10 w-full bg-white '>
           <View className="items-end">
            <Text className="text-[14.25px] font-bold mx-6 my-2 ">TOPLAM 0 TL</Text>
           </View>
           <View className='content-center items-center mt-4 mb-6 '>
               <OkInput title='DEVAM ET'  disabled={ProductItems.length === 0}/>
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
          {ProductItems.map((item) => (
            <View 
              key={item.variantId} 
              className="flex-row pb-4 mb-4 "
            >
              {/* Ürün Resmi */}
              <Image
                source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
                className="w-[87px] h-[87px] "
                resizeMode="cover"
              />

              {/* Ürün Bilgileri */}
            <View className="flex-1 items-end  ml-4">
                {/* Ürün Adı ve Fiyat - Üst Kısım */}
                <View className="flex-row justify-between items-start  mb-2">
                  <View className=" mr-2">
                    <Text className="text-base font-bold mb-1" numberOfLines={2}>
                      {item.productName.toUpperCase()}
                    </Text>
                    
                    {/* Aroma ve Boyut */}
                    {item.aroma && (
                      <Text className="text-[15.13px] font-bold text-basketText mb-3">
                        {item.aroma}
                      </Text>
                    )}
                    
                    {item.size && (
                      <Text className="text-[15.13px] font-bold text-basketText ">
                        {formatSize(item.size)}
                      </Text>
                    )}
                  </View>
             
              <View className='flex-col gap-6 '>
                  {/* Fiyat */}
                  <View className="items-end mx-2">
                    <Text className="text-base font-bold">
                      {Math.round(item.price)} TL
                    </Text>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <Text className="text-xs text-gray-400 line-through">
                        {Math.round(item.oldPrice)} TL
                      </Text>
                    )}
                  </View>

                     {  /* Miktar Kontrolü - Alt Kısım */}
                <View className='w-[135px] h-[37px] bg-white rounded-l  items-center justify-between mx-2 '
                  style={{
                   shadowColor: "#000",
                   shadowOffset: { width: 0, height: 2 }, // daha yumuşak ve aşağı
                   shadowOpacity: 0.08,
                   shadowRadius: 8,
                     }}>
                  <View className="flex-row gap-6 items-center justify-center h-full px-3">
                  {/* Silme Butonu */}
                  <TouchableOpacity
                    onPress={() => removeItem(item.variantId)}
                    className="mr-3"
                  >
                    <Feather name="trash-2" size={18} color="#000" />
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
            </View>
            </View>
          </View>
          ))}
      </View>
      </ScrollView>

      {/* Sticky Bottom Bar - Dolu Sepet */}
      <View >
          <View className='items-end '>
             <Text className="text-[14.25px] font-bold mx-6 my-2 ">
                 TOPLAM {Math.round(totalPrice)} TL
             </Text>
          </View>

         <View className='content-center items-center mt-4 mb-6 '>
          <OkInput title='DEVAM ET'/>
         </View>
       
      </View>
    </SafeAreaView>
  );
};

export default Basket;
