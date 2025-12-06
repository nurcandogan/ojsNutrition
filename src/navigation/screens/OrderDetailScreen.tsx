import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL, MEDIA_BASE_URL } from '@env';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { fetchOrderDetail, OrderDetail } from '../services/orderService';

// Tarih Formatlayıcı
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};
// Dinamik Boyut Etiketi
const getSizeLabel = (size: any) => {
    if (!size) return null;
    if (size.gram) return `${size.gram} Gr`;
    if (size.liter) return `${size.liter} Litre`;
    if (size.total_services) return `${size.total_services} Servis`;
    if (size.pieces) return `${size.pieces} Adet`; 
    return null;
};

interface DetailParams {
    orderId: string;
    orderDate?: string;
}

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, orderDate } = route.params as DetailParams;

  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [orderId]);

  const loadDetail = async () => {
    setLoading(true);
    const data = await fetchOrderDetail(orderId);
    // 🔥 KARGO SORUNUNU ÇÖZMEK İÇİN KONSOLA YAZDIRIYORUZ
    console.log("📦 KARGO VERİSİ KONTROL:", JSON.stringify(data, null, 2));
    
    setDetail(data);
    setLoading(false);


    // Konsola basıp gelen veriyi kontrol edelim (İsim ve indirim var mı?)
    console.log("DETAY VERİSİ:", JSON.stringify(data, null, 2));
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

  const { address, payment_detail, shopping_cart, shipment_tracking_number, cargo_firm,  order_no } = detail;

  // 1. TARİH
  const dateToUse = orderDate || detail.created_at;
  const displayDate = dateToUse ? formatDate(dateToUse) : "Tarih Bilgisi Yok";

  // 2. İSİM SOYİSİM KONTROLÜ (Çoklu kontrol)
  // Backend bazen first_name gönderir, bazen göndermez. Kontrol ediyoruz.
  let fullName = "";
  if (address.first_name || address.last_name) {
      fullName = `${address.first_name || ''} ${address.last_name || ''}`.trim();
  } 


  // 3. İNDİRİM HESAPLAMA (Manuel Kontrol)
  // Eğer discount_amount 0 ise ama Base Price, Final Price'dan büyükse indirimi biz hesaplarız.
  let finalDiscount = payment_detail.discount_amount;
  if (!finalDiscount || finalDiscount === 0) {
      if (payment_detail.base_price > payment_detail.final_price) {
          finalDiscount = payment_detail.base_price - payment_detail.final_price;
      }
  }

   const cargoLabel = cargo_firm ? cargo_firm : "Yurtiçi Kargo";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Sipariş Detayı" onPress={() => navigation.goBack()} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* ÜST BİLGİ */}
        <View className="px-3 py-4 border-b border-black mx-3 mt-3">
            <Text className="text-black text-[13.88px]">
                {displayDate} Tarihinde Sipariş Verildi - {order_no} numaralı sipariş
            </Text>
        </View>

        {/* ÜRÜN LİSTESİ */}
        <View className="px-4">
            {shopping_cart.items.map((item, index) => {
                const imgUrl = item.product_variant_detail?.photo_src 
                    ? `${MEDIA_BASE_URL}${item.product_variant_detail.photo_src}` 
                    : null;
                
                const sizeText = getSizeLabel(item.product_variant_detail?.size);

                return (
                    <View key={index} className="flex-row py-4 border-b border-black">
                        {/* Resim */}
                        <View className="w-[108px] h-[108px] mr-4 overflow-hidden items-center justify-center">
                           {imgUrl ? (
                               <Image source={{ uri: imgUrl }} className="w-full h-full" resizeMode="contain" />
                           ) : (
                               <View className="bg-gray-100 w-full h-full" />
                           )}
                        </View>
                        
                        {/* Bilgiler */}
                        <View className="flex-1 justify-center">
                            {/* İSİM: Eğer item.product yetersizse varyant detayına bakabiliriz ama genelde item.product ana isimdir */}
                            <Text className="text-black font-semibold text-[15px] mb-1 uppercase">
                                {item.product} <Text className="text-black font-normal"><Text className='text-sm'>x </Text>{item.pieces}</Text>
                            </Text>
                            
                            <Text className="text-black text-[13.75px] mb-1">
                                {Math.round(item.unit_price)} TL
                            </Text>

                            {sizeText && (
                                <Text className="text-black text-[13.75px]">
                                    Boyut: {sizeText}
                                </Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>

        {/* KARGO TAKİP */}
        {shipment_tracking_number && (
            <View className="px-4 py-3 border-b border-black mx-3 flex-row justify-between items-center">
                <Text className="text-[12.5px] text-black ">{cargoLabel} <Text className='text-[13.75px]'>  Takip Numarası:</Text>
                </Text>
                <Text className="text-[13.75px] mr-10 text-black ">{shipment_tracking_number}</Text>
            </View>
        )}

        {/* ADRES ALANI */}
        <View className="px-4 py-5 border-b border-black mx-3">
            <Text className="font-bold text-black mb-4 text-base">Adres</Text>
            
            {/* İSİM GÖSTERİMİ */}
            {fullName ? (
                <Text className="text-black text-[13.75px] mb-1 font-medium uppercase">{fullName}</Text>
            ) : (
                // İsim yoksa Adres Başlığını (EV, İŞ vb.) gösterelim ki boş durmasın
                <Text className="text-black text-[13.75px] mb-1 font-medium uppercase">{address.title}</Text>
            )}
            
            <Text className="text-black text-[13.75px]">
                {address.full_address}
            </Text>
        </View>

        {/* FİYAT ÖZETİ */}
        <View className="px-4 py-5 border-b border-black mx-3">
            <Text className="font-bold text-black mb-4 text-base">Özet</Text>
            
            <View className="flex-row justify-between mb-2">
                <Text className="text-black text-[13.75px]">Ara Toplam</Text>
                <Text className="text-black text-[13.75px]">{payment_detail.base_price} TL</Text>
            </View>
            
            <View className="flex-row justify-between ">
                <Text className="text-black text-[13.75px]">Kargo</Text>
                <Text className="text-black text-[13.75px]">
                    {payment_detail.shipment_fee === 0 ? "0 TL" : `${payment_detail.shipment_fee} TL`}
                </Text>
            </View>

            {/* İNDİRİM GÖSTERİMİ (Otomatik veya Manuel Hesaplanan) */}
            {finalDiscount > 0 && (
                <View className="flex-row justify-between mb-2">
                    <Text className="text-green-600 font-medium">İndirim</Text>
                    <Text className="text-green-600 font-medium">-{Math.round(finalDiscount)} TL</Text>
                </View>
            )}

            <View className="flex-row justify-between pt-2 ">
                <Text className="text-black font-bold text-[13.75px]">Toplam</Text>
                <Text className="text-black font-bold text-[13.75px]">{Math.round(payment_detail.final_price)} TL</Text>
            </View>
        </View>

        {/* YARDIM */}
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