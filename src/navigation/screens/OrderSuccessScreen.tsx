import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { fetchOrderDetail, OrderDetail } from '../services/orderService';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput'; 
import { clearRemoteCart } from '../services/basketService';

interface OrderSuccessRouteParams {
    orderId: string;
}

const OrderSuccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { orderId } = route.params as OrderSuccessRouteParams;
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const loadOrderDetail = async () => {
    setLoading(true);
    const detail = await fetchOrderDetail(orderId);
    setOrderDetail(detail);
    setLoading(false);
  };

  const handleGoHome = () => {
    navigation.popToTop(); 
  };



useEffect(() => {
    // Sipariş detaylarını çek
    loadOrderDetail();
    
    // 🔥 GÜVENLİK ÖNLEMİ:
    // Sipariş bittiğine göre, Backend'deki sepeti de zorla temizle.
    // (Arka planda sessizce çalışsın, await ile beklemeye gerek yok)
    clearRemoteCart(); 
    
  }, [orderId]);

  
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-gray-600">Sipariş detayları yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (!orderDetail) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <BackHeader title="Sipariş Detayı" onPress={handleGoHome} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-bold text-red-500">Sipariş detayları bulunamadı.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { order_no, address, payment_detail, shopping_cart } = orderDetail;
  const paymentTypeLabel = payment_detail.payment_type === 'credit_cart' ? 'Kredi/Banka Kartı' : 'Kapıda Ödeme';
  const finalPrice = Math.round(payment_detail.final_price);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 150 }}>
        <BackHeader title="Satın Al / Sipariş Alındı" onPress={handleGoHome} />

        {/* --- BAŞARI KUTUSU --- */}
        <View className="px-5 py-8 items-center bg-green-50 border-b border-green-200">
          <Feather name="check-circle" size={48} color="#10B981" />
          <Text className="text-2xl font-bold text-green-700 mt-4">Siparişiniz Alındı</Text>
          <Text className="text-sm text-gray-600 mt-2">Sipariş No: **{order_no}**</Text>
        </View>

        {/* --- SİPARİŞ ÖZETİ --- */}
        <View className="px-5 mt-6">
          {/* Adres Bilgisi */}
          <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <Text className="text-base font-bold mb-2">Teslimat Adresi: {address.title}</Text>
            <Text className="text-sm text-gray-700">{address.full_address}</Text>
          </View>

          {/* Ödeme Bilgisi */}
          <View className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <Text className="text-base font-bold mb-2">Ödeme Bilgileri</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-700">Ödeme Yöntemi:</Text>
              <Text className="text-sm font-semibold">{paymentTypeLabel}</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-gray-700">Toplam Ödenen:</Text>
              <Text className="text-sm font-bold text-indigo-600">{finalPrice} TL</Text>
            </View>
          </View>
          
           {/* Ürün Listesi */}
           <Text className="text-base font-bold mb-3">Ürünler ({shopping_cart.items.length})</Text>
           {shopping_cart.items.map((item, index) => (
             <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
               <View className="flex-1 pr-4">
                 <Text className="text-sm font-semibold" numberOfLines={1}>{item.product}</Text>
               </View>
               <Text className="text-sm text-gray-700">{item.pieces} x {Math.round(item.unit_price)} TL</Text>
             </View>
           ))}

        </View>
      </ScrollView>

      {/* --- ALT SABİT ALAN --- */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pb-6 pt-3 border-t border-gray-200">
        <View className="content-center items-center mt-2">
          <OkInput title="ANA SAYFAYA DÖN" onPress={handleGoHome} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OrderSuccessScreen;