import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL, MEDIA_BASE_URL } from '@env';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader'; // Kendi header bileşenin
import { fetchOrderDetail, OrderDetail } from '../services/orderService';

// Tarih formatlayıcı (Örn: 14 Aralık 2022)
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

interface DetailParams {
    orderId: string;
}

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as DetailParams;

  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [orderId]);

  const loadDetail = async () => {
    setLoading(true);
    const data = await fetchOrderDetail(orderId);
    setDetail(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text>Sipariş detayları alınamadı.</Text>
      </SafeAreaView>
    );
  }

  const { address, payment_detail, shopping_cart, order_status, shipment_tracking_number } = detail;

  // Sipariş Tarihini (created_at servisten geliyorsa kullan, yoksa şimdilik statik)
  const displayDate = "created_at" in detail ? formatDate(detail.created_at as string) : formatDate(new Date().toISOString());

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header: Tasarımdaki gibi "Sipariş Teslim Edildi" vb. yazabilirsin */}
      <BackHeader title="Sipariş Detayı" onPress={() => navigation.goBack()} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* 1. ÜST BİLGİ ALANI */}
        <View className="px-3 py-4 border-b border-black mx-3 mt-3">
            <Text className="text-black text-[13.88px]">
                {displayDate} Tarihinde Sipariş Verildi - {detail.order_no} numaralı sipariş
            </Text>
        </View>

        {/* 2. ÜRÜN LİSTESİ */}
        <View className="px-4">
            {shopping_cart.items.map((item, index) => {
                // Resim URL kontrolü
                const imgUrl = item.product_variant_detail?.photo_src 
                    ? `${MEDIA_BASE_URL}${item.product_variant_detail.photo_src}` 
                    : null;
                
                return (
                    <View key={index} className="flex-row py-4 border-b border-black">
                        {/* Ürün Resmi */}
                        <View className="w-[108px] h-[108px]  mr-4 overflow-hidden ">
                           {imgUrl && (
                               <Image source={{ uri: imgUrl }} className="w-full h-full" resizeMode="contain" />
                           )}
                        </View>
                        
                        {/* Ürün Bilgileri */}
                        <View className="flex-1 justify-center">
                            {/* İsim ve Adet */}
                            <Text className="text-black font-semibold text-[15px] mb-1 uppercase">
                                {item.product} <Text className=" text-black"><Text className='text-sm'>x </Text>{item.pieces}</Text>
                            </Text>
                            
                            {/* Fiyat */}
                            <Text className="text-black text-[13.75px] mb-1">
                                {Math.round(item.unit_price)} TL
                            </Text>

                            {/* Varsa Boyut / Varyant Bilgisi */}
                            {item.product_variant_detail?.size?.pieces ? (
                                <Text className="text-black text-[13.75px]">
                                    Boyut: {item.product_variant_detail.size.pieces} KUTU
                                </Text>
                            ) : null}
                        </View>
                    </View>
                );
            })}
        </View>

        {/* 3. KARGO TAKİP (Eğer varsa göster) */}
        {shipment_tracking_number && (
            <View className="px-4 py-3 border-b border-black mx-3 flex-row justify-between">
                <Text className="text-[13.75px] mx-3  text-black">Kargo Takip Numarası:</Text>
                <Text className="text-[13.75px] mr-20 text-black">{shipment_tracking_number}</Text>
            </View>
        )}

        {/* 4. ADRES BİLGİSİ */}
        <View className="px-4 py-5 border-b border-black mx-3">
            <Text className="font-bold text-black mb-2 text-base">Adres</Text>
            <Text className="text-black text-[13.75px] mb-1">{address.title}</Text>
            <Text className="text-black text-[13.75px] ">
                {address.full_address}
            </Text>
        </View>

        {/* 5. FİYAT ÖZETİ */}
        <View className="px-4 py-5 border-b border-black mx-3">
            <Text className="font-bold text-black mb-4 text-base">Özet</Text>
            
            <View className="flex-row justify-between mb-2">
                <Text className="text-black">Ara Toplam</Text>
                <Text className="text-black ">{payment_detail.base_price} TL</Text>
            </View>
            
            <View className="flex-row justify-between mb-2">
                <Text className="text-black">Kargo</Text>
                <Text className="text-black ">
                    {payment_detail.shipment_fee === 0 ? "0 TL" : `${payment_detail.shipment_fee} TL`}
                </Text>
            </View>

            {payment_detail.discount_amount > 0 && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-black">İndirim</Text>
                    <Text className="text-black font-medium">-{payment_detail.discount_amount} TL</Text>
                </View>
            )}

            <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-100">
                <Text className="text-black font-bold text-lg">Toplam</Text>
                <Text className="text-black font-bold text-lg">{Math.round(payment_detail.final_price)} TL</Text>
            </View>
        </View>

        {/* 6. YARDIM ALANI */}
        <View className="px-4 py-6 mx-3">
            <Text className="font-bold text-black mb-3 text-base">Yardıma mı ihtiyacın var?</Text>
            
            <TouchableOpacity className="mb-2">
                <Text className="text-black text-[13.5px]">Sıkça Sorulan Sorular</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
                <Text className="text-black text-[13.5px]">Satış Sözleşmesi</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;