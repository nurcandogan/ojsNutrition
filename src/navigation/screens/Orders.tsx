import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader'; // Senin header bileşenin
import { fetchAllOrders, OrderListItem } from '../services/orderService';

// Tarihi istediğin formatta yazar: "31 Mart 2023"
const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Duruma göre yazı ve renk ayarı
const getStatusInfo = (status: string) => {
    switch (status) {
        case 'delivered': 
            return { text: 'Teslim Edildi', color: '#7AC142' }; // Yeşil
        case 'getting_ready': 
            return { text: 'Hazırlanıyor', color: '#F59E0B' }; // Turuncu
        case 'shipped': 
            return { text: 'Kargoda', color: '#3B82F6' }; // Mavi
        case 'cancelled': 
            return { text: 'İptal Edildi', color: '#EF4444' }; // Kırmızı
        default: 
            return { text: 'İşlemde', color: '#6B7280' }; // Gri
    }
};

const MyOrdersScreen = () => {
  const navigation = useNavigation<any>();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const renderItem = ({ item }: { item: OrderListItem }) => {
    const statusInfo = getStatusInfo(item.order_status);
    // İlk ürünün ismini al, yoksa varsayılan yaz
    const mainProductName = item.cart_detail?.[0]?.name || "Sipariş Ürünü";

    return (
      <View className="border-b border-gray-200 py-6 px-4 bg-white">
        
        {/* Durum Yazısı (Yeşil) */}
        <Text style={{ color: statusInfo.color }} className="font-medium text-sm mb-1">
            {statusInfo.text}
        </Text>

        {/* Ürün İsmi (Kalın Siyah) */}
        <Text className="text-black font-bold text-lg mb-1 uppercase tracking-wide">
            {mainProductName}
        </Text>

        {/* Tarih Bilgisi */}
        <Text className="text-black text-sm mb-1">
            {formatDate(item.created_at)} Tarihinde Sipariş Verildi
        </Text>

        {/* Sipariş Numarası */}
        <Text className="text-black text-sm mb-4">
            {item.order_no} numaralı sipariş
        </Text>

        {/* Buton */}
        <TouchableOpacity 
            onPress={() => navigation.navigate('OrderDetailScreen', { orderId: item.order_no })}
            className="border border-black rounded py-2.5 px-5 self-start active:bg-gray-100"
        >
            <Text className="text-black font-medium text-sm">
                Detayı Görüntüle
            </Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <BackHeader 
        title={`Siparişlerim (${orders.length})`} 
        onPress={() => navigation.goBack()} 
      />

      {loading ? (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_no}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
          ListEmptyComponent={
            <View className="mt-20 items-center px-10">
                <Text className="text-gray-500 text-center">Henüz bir siparişiniz bulunmuyor.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyOrdersScreen;