import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { fetchOrderDetail, OrderDetail } from '../services/orderService';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput'; 
import { clearRemoteCart } from '../services/basketService';
import OrderIcon from '../../Svgs/OrderIcon';

// 🔥 Senin oluşturduğun SVG ikonunu buraya import etmelisin.
// Yolunu kendi projene göre düzenle (Örn: '../../assets/svg/OrderIcon')

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
    // Sipariş tamamlandığı için arka planda sepeti temizle
    clearRemoteCart(); 
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
  // Fiyatı yuvarla
  const finalPrice = Math.round(payment_detail.final_price);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <BackHeader title="Ana Sayfa" onPress={handleGoHome} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 150 }}>
        
        <View className="items-center py-8  mb-4">
          <View className="mb-4 mt-20">
             <OrderIcon  /> 
          </View>
          
          <Text className="text-[22px] font-semibold text-black">Siparişiniz Alındı</Text>
          <Text className="text-sm text-gray-500 mt-2">Sipariş No: **{order_no}**</Text>
        </View>

        {/* --- KARTLAR ALANI --- */}
        <View className="px-5">

          {/* 1. KART: TESLİMAT ADRESİ */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-base font-bold text-black mb-2">
              Teslimat Adresi: {address.title}
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {address.full_address}
            </Text>
          </View>

          {/* 2. KART: ÖDEME BİLGİLERİ */}
          <View className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
            <Text className="text-base font-bold text-black mb-3">Ödeme Bilgileri</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-gray-500">Ödeme Yöntemi:</Text>
              <Text className="text-sm font-semibold text-black">{paymentTypeLabel}</Text>
            </View>
            
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-gray-500">Toplam Ödenen:</Text>
              <Text className="text-base font-bold text-indigo-600">{finalPrice} TL</Text>
            </View>
          </View>

          {/* 3. LİSTE: ÜRÜNLER */}
          <View className='mx-4 '>
             <Text className="text-lg font-bold text-black mb-3">
                Ürünler ({shopping_cart.items.length})
             </Text>
             
             {shopping_cart.items.map((item, index) => (
               <View key={index} className="flex-row justify-between items-center py-4 border-b border-gray-100">
                 {/* Sol Taraf: Ürün İsmi */}
                 <View className="flex-1 pr-4">
                   <Text className="text-sm font-semibold text-gray-800 uppercase">
                     {item.product}
                   </Text>
                 </View>
                 
                 {/* Sağ Taraf: Adet x Fiyat */}
                 <Text className="text-sm text-gray-500">
                   {item.pieces} x {Math.round(item.unit_price)} TL
                 </Text>
               </View>
             ))}
          </View>

        </View>
      </ScrollView>

      {/* --- ALT SABİT BUTON --- */}
      <View className="absolute bottom-0 left-0 right-0 bg-white pb-8 pt-4 mb-8   border-gray-100 mx-auto w-full px-5">
        <OkInput title="Siparişe Git" onPress={handleGoHome} />
      </View>

    </SafeAreaView>
  );
};

export default OrderSuccessScreen;