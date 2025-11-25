// src/screens/CheckoutScreen.tsx (GÜNCELLENMİŞ VE SON HALİ)

import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';

// Diğer Bileşenler ve Servisler
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput'; 
import { AddressProps, fetchAddresses } from '../services/addressService';
import { useCartStore } from '../../store/cartStore'; 
import { createOrder } from '../services/orderService';
import CardFormInputs from '../../components/TabsMenu/Order/CardFormInputs';


const SHIPPING_FEE = 20; 
const CASH_ON_DELIVERY_FEE = 39; 

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const { getTotalPrice, clearCart, ProductItems } = useCartStore();
  const totalPrice = getTotalPrice(); 

  // --- Adres State'leri ---
  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  // --- Ödeme/Kargo State'leri ---
  const [selectedPaymentType, setSelectedPaymentType] = useState<'credit_card_form' | 'cash_on_delivery_cash' | 'cash_on_delivery_card'>('credit_card_form');
  const [isBillingSame, setIsBillingSame] = useState(true); 
  const [isContractChecked, setIsContractChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- Kart State'leri (State'ler bu ekranda kalmak ZORUNDADIR) ---
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpire, setCardExpire] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // --- Hesaplamalar ---
  const paymentFee = (selectedPaymentType === 'cash_on_delivery_cash' || selectedPaymentType === 'cash_on_delivery_card') ? CASH_ON_DELIVERY_FEE : 0;
  const finalPrice = totalPrice + SHIPPING_FEE + paymentFee;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  
  // --- Adres Çekme İşlevi (Aynı) ---
  const loadAddresses = async () => {
    setLoading(true);
    try {
      const fetchedAddresses = await fetchAddresses();
      setAddresses(fetchedAddresses);
      if (!selectedAddressId && fetchedAddresses.length > 0) {
        setSelectedAddressId(fetchedAddresses[0].id);
      }
    } catch (error) {
      Alert.alert("Hata", "Adresler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadAddresses();
  }, []));

  const handleEditAddress = (address: AddressProps) => {
    navigation.navigate('AddressForm', { addressToEdit: address }); 
  }
  
  // --- SİPARİŞİ TAMAMLA İŞLEVİ (Aynı) ---
  const handlePlaceOrder = async () => {
    if (loading) return;
    
    if (!selectedAddressId) {
      Alert.alert("Uyarı", "Lütfen bir teslimat adresi seçin.");
      return;
    }
    if (!isContractChecked) {
      Alert.alert("Uyarı", "Lütfen sözleşmeyi onaylayın.");
      return;
    }

    let cardDetails = undefined;
    if (selectedPaymentType === 'credit_card_form') {
      if (!cardNumber || !cardHolder || !cardExpire || !cardCvc) {
        Alert.alert("Uyarı", "Lütfen tüm kart bilgilerini eksiksiz doldurun.");
        return;
      }
      cardDetails = { cardNumber, cardHolder, cardExpire, cardCvc, cardType: 'VISA' };
    }

    setLoading(true);

    try {
      const result = await createOrder(selectedAddressId, selectedPaymentType, cardDetails);

      if (result.success && result.orderNo) {
        clearCart(); 
        navigation.navigate('OrderSuccessScreen', { orderId: result.orderNo });
      } else {
        Alert.alert("Hata", result.message);
      }
    } catch (error) {
      Alert.alert("Hata", "Sipariş oluşturulurken beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };


  // --- Ödeme Seçeneği Bileşeni (Aynı) ---
  const PaymentOption: React.FC<{ type: string, title: string, fee?: number }> = ({ type, title, fee }) => (
    <TouchableOpacity
      onPress={() => setSelectedPaymentType(type as any)}
      className={`p-4 border rounded-lg mb-3 flex-row justify-between items-center ${
        selectedPaymentType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
      }`}
    >
      <View className="flex-row items-center">
        <Feather name={selectedPaymentType === type ? "check-circle" : "circle"} size={20} color="#4F46E5" />
        <Text className="ml-3 text-base font-semibold">{title}</Text>
      </View>
      {fee !== undefined && fee > 0 && <Text className="text-sm font-bold text-red-500">{fee} TL İşlem Bedeli</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Satın Al / Ödeme" onPress={() => navigation.goBack()} />

      {/* --- ÜRÜN ÖZETİ (Sürekli Açık) --- */}
      {/* Not: OrderSummaryCollapse bileşeni yerine basitleştirilmiş bir başlık kullanıldı. */}
      <View className="bg-white border-b border-gray-200 px-5 py-4">
          <Text className="text-xl font-bold">Özet: {Math.round(finalPrice)} TL ({ProductItems.reduce((sum, item) => sum + item.quantity, 0)} ürün)</Text>
      </View>


      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* ========================================================= */}
        {/* --- 1. ADRES BİLGİLERİ --- */}
        {/* ========================================================= */}
        <View className="mt-4 mb-6">
            <Text className="text-xl font-bold mb-3">1. Teslimat Adresi</Text>
            
            {/* Adres Seçim Alanı (Tasarımınıza uygun) */}
            <View className="mb-4">
                <View className="border border-gray-300 rounded-md h-[50px] flex-row items-center justify-between px-3">
                    <Text className="text-gray-700">
                        {selectedAddress ? `${selectedAddress.title} (${selectedAddress.region.name} / ${selectedAddress.country.name})` : "Adres seçiniz..."}
                    </Text>
                    <Feather name="chevron-down" size={20} color="#6B7280" />
                </View>
                
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AddressForm', { isNew: false, addressToEdit: selectedAddress })}
                    className="absolute top-0 right-0 py-1"
                >
                    <Text className="text-indigo-600 font-semibold text-sm">Ekle / Düzenle</Text>
                </TouchableOpacity>

            </View>
            
            {/* Fatura Adresi Checkbox */}
            <TouchableOpacity onPress={() => setIsBillingSame(!isBillingSame)} className="flex-row items-center mt-3">
                <Feather name={isBillingSame ? "check-square" : "square"} size={20} color="#4F46E5" />
                <Text className="ml-2 text-base text-gray-700">Faturamı aynı adrese gönder.</Text>
            </TouchableOpacity>

        </View>

        {/* ========================================================= */}
        {/* --- 2. KARGO SEÇİMİ --- */}
        {/* ========================================================= */}
        <View className="mt-4 mb-6">
            <Text className="text-xl font-bold mb-3">2. Kargo</Text>
            
            <View className={`flex-row items-center p-3 border border-gray-200 rounded-md bg-green-50`}>
                <Text className="text-base font-semibold text-green-700">
                    Kargo {SHIPPING_FEE} TL:
                </Text>
                <Text className="text-sm ml-2 text-gray-700 flex-1">
                    16:00 öncesi siparişler aynı gün kargolanır.
                </Text>
            </View>
        </View>
        
        {/* ========================================================= */}
        {/* --- 3. ÖDEME SEÇİMİ --- */}
        {/* ========================================================= */}
        <View className="mt-4 mb-6">
            <Text className="text-xl font-bold mb-3">3. Ödeme</Text>
            
             {/* KREDİ KARTI SEÇENEĞİ */}
            <TouchableOpacity 
                onPress={() => setSelectedPaymentType('credit_card_form')}
                className={`p-4 border rounded-lg mb-3 ${selectedPaymentType === 'credit_card_form' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
            >
                 <View className="flex-row items-center">
                    <Feather name={selectedPaymentType === 'credit_card_form' ? "check-circle" : "circle"} size={20} color="#4F46E5" />
                    <Text className="ml-3 text-base font-semibold">Kredi Kartı</Text>
                </View>
                
                {/* --- KART BİLGİLERİ FORMU (SADECE KREDİ KARTI SEÇİLİRSE GÖRÜNÜR) --- */}
                {selectedPaymentType === 'credit_card_form' && (
                    // 🔥 Yeni bileşeni çağırıyoruz
                    <CardFormInputs
                        cardNumber={cardNumber} setCardNumber={setCardNumber}
                        cardHolder={cardHolder} setCardHolder={setCardHolder}
                        cardExpire={cardExpire} setCardExpire={setCardExpire}
                        cardCvc={cardCvc} setCardCvc={setCardCvc}
                    />
                )}
            </TouchableOpacity>
            
            {/* KAPIDA ÖDEME SEÇENEKLERİ */}
            <PaymentOption 
                 type="cash_on_delivery_cash" 
                 title="Kapıda Ödeme (Nakit)" 
                 fee={paymentFee} 
            />
            <PaymentOption 
                 type="cash_on_delivery_card" 
                 title="Kapıda Ödeme (Kredi Kartı)" 
                 fee={paymentFee} 
            />
            
            {/* --- SÖZLEŞME ONAY KISMI --- */}
            <View className="flex-row items-start mt-6 mb-4">
                <TouchableOpacity onPress={() => setIsContractChecked(!isContractChecked)} className="mt-1">
                    <Feather name={isContractChecked ? "check-square" : "square"} size={20} color="#4F46E5" /> 
                </TouchableOpacity>
                <Text className="ml-2 flex-1 text-xs leading-5 text-gray-700">
                    Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum.
                </Text>
            </View>

            {/* Ödemeyi Tamamla Butonu (Sayfanın en alt butonu) */}
            <OkInput 
                title={loading ? "SİPARİŞ OLUŞTURULUYOR..." : `ÖDEMEYİ TAMAMLA (${Math.round(finalPrice)} TL)`}
                onPress={handlePlaceOrder}
                disabled={loading || !selectedAddressId || !isContractChecked || (selectedPaymentType === 'credit_card_form' && (!cardNumber || !cardHolder || !cardExpire || !cardCvc))}
            />

        </View>
        
        {/* Alt boşluk */}
        <View className="h-10" /> 
      </ScrollView>

    </SafeAreaView>
  );
};

export default CheckoutScreen;