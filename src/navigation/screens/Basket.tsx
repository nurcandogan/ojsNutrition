import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env';
import { useCartStore } from '../../store/cartStore';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput';
import SwipeableItem from '../../components/SwipeableItem';
import DeleteIcon from '../../Svgs/DeleteIcon';

const Basket = () => {
  const navigation = useNavigation();
  const { ProductItems, increaseQuantity, decreaseQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  // Boyut formatı (250g, 60 tablet vb)
  const formatSize = (size: { gram: number | null; pieces: number | null; total_services: number | null; }) => {
    if (size?.gram) return `${size.gram}g`;
    if (size?.pieces) return `${size.pieces} tablet`;
    if (size?.total_services) return `${size.total_services} servis`;
    return '';
  };

    const onClick = () => navigation.navigate('CheckoutScreen' as any)


  // ----- BOŞ SEPET -----
  if (ProductItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-6 pb-4">
          <Text className="text-[17.66px] font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>

        <View className="mt-2 items-center justify-center px-6">
          <Text className="text-[13.5px] text-black text-center">
            Sepetinizde Ürün Bulunmamaktadır
          </Text>
        </View>

        <View className="absolute bottom-10 w-full bg-white">
          <View className="items-end">
            <Text className="text-[14.25px] font-bold mx-6 my-2">TOPLAM 0 TL</Text>
          </View>

          <View className="content-center items-center mt-4 mb-6">
            <OkInput title="DEVAM ET" disabled={true} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ----- DOLU SEPET -----
  return (
    <SafeAreaView className="flex-1 bg-white">

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-6 pb-4">
          <Text className="text-2xl font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>

        <View className="px-5 mt-4">

          {ProductItems.map((item) => (
           <SwipeableItem  key={item.variantId}
              onDelete={() => removeItem(item.variantId)}>
            <View key={item.variantId} className="flex-row pb-5 mb-5 border-b border-gray-100 ">

              {/* Ürün Resmi */}
              <Image
                source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
                className="w-[87px] h-[87px] "
                resizeMode="cover"
              />

              {/* SAĞ TARAF */}
              <View className="flex-1 ml-4">

                <View className="flex-row justify-between flex-1">

                  {/* SOL KOLON (YAZILAR) */}
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-bold mb-1" numberOfLines={2}>
                      {item.productName?.toUpperCase()}
                    </Text>

                    {item.aroma && (
                      <Text className="text-[15px] font-bold text-basketText">
                        {item.aroma}
                      </Text>
                    )}

                    {item.size && (
                      <Text className="text-[15px] font-bold text-basketText mt-1">
                        {formatSize(item.size)}
                      </Text>
                    )}
                  </View>

                  {/* SAĞ KOLON (FİYAT + MİKTAR) */}
                  <View className="items-end">

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

                    {/* Miktar kontrolü */}
                    <View
                      className="w-[135px] h-[37px] bg-white mt-5 rounded-xl justify-center"
                      style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                      }}
                    >
                      <View className="flex-row gap-6  items-center justify-center">

                        {item.quantity === 1 ? (
                          <TouchableOpacity onPress={() => removeItem(item.variantId)}>
                             <DeleteIcon width={17} height={17} />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => decreaseQuantity(item.variantId)}>
                            <Feather name="minus" size={19} color="#000" />
                          </TouchableOpacity>
                        )}
                        <Text className="text-base font-semibold">
                          {item.quantity}
                        </Text>

                        <TouchableOpacity onPress={() => increaseQuantity(item.variantId)}>
                          <Feather name="plus" size={19} color="#000" />
                        </TouchableOpacity>

                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
           </SwipeableItem>
            
          ))}

        </View>
      </ScrollView>

      {/* ALT SABİT ALAN */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pb-6 pt-3">
        <View className="items-end">
          <Text className="text-[14.25px] font-bold mx-6 my-2">
            TOPLAM {Math.round(totalPrice)} TL
          </Text>
        </View>
        <View  className="content-center mb-10 items-center mt-2">
          <OkInput onPress={onClick} title="DEVAM ET  " />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default Basket;
