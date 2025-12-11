import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env';
import { useCartStore } from '../../store/cartStore';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput';
import SwipeableItem from '../../components/SwipeableItem';
import DeleteIcon from '../../Svgs/DeleteIcon';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import KESİN OLMALI

const Basket = () => {
  const navigation = useNavigation<any>();
  const { ProductItems, increaseQuantity, decreaseQuantity, removeItem, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const formatSize = (size: any) => {
    if (size?.gram) return `${size.gram}g`;
    if (size?.pieces) return `${size.pieces} tablet`;
    if (size?.total_services) return `${size.total_services} servis`;
    return '';
  };  

  // --- KONTROL MEKANİZMASI ---
  const onClick = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      console.log("Sepet Kontrolü - Token Durumu:", token ? "Var" : "Yok");

      if (token) {
        // Giriş yapılmış -> Ödemeye geç
        navigation.navigate('CheckoutScreen');
      } else {
        // Giriş yapılmamış -> Uyarı ver
        Alert.alert(
          "OJS Nutrition hesabınız yok mu?", 
          "Siparişinizi tamamlamak için lütfen giriş yapın veya üye olun.", 
          [
            { text: "Vazgeç", style: "cancel" },
            { 
              text: "Giriş Yap / Üye Ol", 
              onPress: () => {
                // Login sayfasına 'returnScreen' parametresiyle git
                navigation.navigate('Login', { returnScreen: 'CheckoutScreen' });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error("Hata:", error);
    }
  };

  if (ProductItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-5 pt-6 pb-4">
          <Text className="text-[17.66px] font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>
        <View className="mt-2 items-center justify-center px-6">
          <Text className="text-[13.5px] text-black text-center">Sepetinizde Ürün Bulunmamaktadır</Text>
        </View>
        <View className="absolute bottom-10 w-full bg-white">
          <View className="items-end"><Text className="text-[14.25px] font-bold mx-6 my-2">TOPLAM 0 TL</Text></View>
          <View className="content-center items-center mt-4 mb-6">
            <OkInput title="DEVAM ET" disabled={true} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-5 pt-6 pb-4">
          <Text className="text-2xl font-bold text-center mb-4">SEPETİM</Text>
          <View className="h-[1px] bg-gray-200" />
        </View>
        <View className="px-5 mt-4">
          {ProductItems.map((item) => (
           <SwipeableItem  key={item.variantId} onDelete={() => removeItem(item.variantId)}>
            <View key={item.variantId} className="flex-row pb-5 mb-5 border-b border-gray-100 ">
              <Image source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }} className="w-[87px] h-[87px] " resizeMode="cover"/>
              <View className="flex-1 ml-4">
                <View className="flex-row justify-between flex-1">
                  <View className="flex-1 pr-3">
                    <Text className="text-base font-bold mb-1" numberOfLines={2}>{item.productName?.toUpperCase()}</Text>
                    {item.aroma && <Text className="text-[15px] font-bold text-basketText">{item.aroma}</Text>}
                    {item.size && <Text className="text-[15px] font-bold text-basketText mt-1">{formatSize(item.size)}</Text>}
                  </View>
                  <View className="items-end">
                    <View className="items-end">
                      <Text className="text-base font-bold">{Math.round(item.price)} TL</Text>
                      {item.oldPrice && item.oldPrice > item.price && (<Text className="text-xs text-gray-400 line-through">{Math.round(item.oldPrice)} TL</Text>)}
                    </View>
                    <View className="w-[135px] h-[37px] bg-white mt-5 rounded-xl justify-center shadow-sm border border-gray-100">
                      <View className="flex-row gap-6 items-center justify-center">
                        {item.quantity === 1 ? (
                          <TouchableOpacity onPress={() => removeItem(item.variantId)}><DeleteIcon width={17} height={17} /></TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => decreaseQuantity(item.variantId)}><Feather name="minus" size={19} color="#000" /></TouchableOpacity>
                        )}
                        <Text className="text-base font-semibold">{item.quantity}</Text>
                        <TouchableOpacity onPress={() => increaseQuantity(item.variantId)}><Feather name="plus" size={19} color="#000" /></TouchableOpacity>
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
      <View className="absolute bottom-0 left-0 right-0 bg-white pb-6 pt-3">
        <View className="items-end"><Text className="text-[14.25px] font-bold mx-6 my-2">TOPLAM {Math.round(totalPrice)} TL</Text></View>
        <View className="content-center mb-10 items-center mt-2">
          {/* Tıklama buraya bağlı */}
          <OkInput onPress={onClick} title="DEVAM ET" />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Basket;