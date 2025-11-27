import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput'; 
import { AddressProps, fetchAddresses } from '../services/addressService';
import { useCartStore } from '../../store/cartStore'; 
import { createOrder } from '../services/orderService';
import CardFormInputs from '../../components/TabsMenu/Order/CardFormInputs';
import OrderSummaryCollapse from '../../components/TabsMenu/Order/OrderSummaryCollapse';

const SHIPPING_FEE = 20; 
const CASH_ON_DELIVERY_FEE = 39; 

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const { getTotalPrice, clearCart, ProductItems } = useCartStore();
  const totalPrice = getTotalPrice(); 

  // --- State'ler ---
  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const [selectedPaymentType, setSelectedPaymentType] = useState<'credit_card_form' | 'cash_on_delivery_cash' | 'cash_on_delivery_card'>('credit_card_form');
  const [isBillingSame, setIsBillingSame] = useState(true);
  const [isContractChecked, setIsContractChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Kart State'leri
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpire, setCardExpire] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const paymentFee = (selectedPaymentType === 'cash_on_delivery_cash' || selectedPaymentType === 'cash_on_delivery_card') ? CASH_ON_DELIVERY_FEE : 0;
  const finalPrice = totalPrice + SHIPPING_FEE + paymentFee;
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const itemCount = ProductItems.reduce((sum, item) => sum + item.quantity, 0);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const fetchedAddresses = await fetchAddresses();
      setAddresses(fetchedAddresses);
      if (!selectedAddressId && fetchedAddresses.length > 0) {
        setSelectedAddressId(fetchedAddresses[0].id);
      }
    } catch (error) {
      // Sessizce geçebilir veya loglayabiliriz
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadAddresses();
  }, []));

  const handlePlaceOrder = async () => {
    if (loading) return;
    if (!selectedAddressId) { Alert.alert("Uyarı", "Teslimat adresi seçiniz."); return; }
    if (!isContractChecked) { Alert.alert("Uyarı", "Sözleşmeyi onaylayınız."); return; }

    let cardDetails = undefined;
    if (selectedPaymentType === 'credit_card_form') {
      if (!cardNumber || !cardHolder || !cardExpire || !cardCvc) {
        Alert.alert("Uyarı", "Kart bilgilerini eksiksiz doldurun."); return;
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
      Alert.alert("Hata", "Sipariş oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Satın Al / Ödeme" onPress={() => navigation.goBack()} />

      <OrderSummaryCollapse
          totalAmount={totalPrice}
          itemCount={itemCount}
          paymentFee={paymentFee}
          shipmentFee={SHIPPING_FEE}
      />

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 50 }}>
        
        {/* --- 1. TESLİMAT ADRESİ --- */}
        <View className="mt-5">
            <Text className="text-lg font-bold mb-3 text-black">1. Teslimat Adresi</Text>
            
            {/* Adres Kutusu */}
            <View className="border border-gray-300 rounded-lg p-3 bg-white mb-3">
                <TouchableOpacity 
                    onPress={() => navigation.navigate('AddressForm', { isNew: false, addressToEdit: selectedAddress })}
                    className="flex-row justify-between items-center"
                >
                    <Text className="text-gray-700 text-base" numberOfLines={1}>
                        {selectedAddress 
                            ? `${selectedAddress.title} (${selectedAddress.region.name})` 
                            : "Adres Seçiniz / Ekleyiniz"}
                    </Text>
                    <View className="flex-row items-center">
                        <Text className="text-indigo-600 font-semibold mr-1">Ekle / Düzenle</Text>
                        <Feather name="chevron-down" size={18} color="#4F46E5" />
                    </View>
                </TouchableOpacity>
            </View>
            
            {/* Fatura Checkbox */}
            <TouchableOpacity onPress={() => setIsBillingSame(!isBillingSame)} className="flex-row items-center">
                <Feather name={isBillingSame ? "check-square" : "square"} size={22} color="#4F46E5" />
                <Text className="ml-2 text-sm text-gray-700">Faturamı aynı adrese gönder.</Text>
            </TouchableOpacity>
        </View>

        {/* --- 2. KARGO --- */}
        <View className="mt-6">
            <Text className="text-lg font-bold mb-3 text-black">2. Kargo</Text>
            <View className="flex-row items-center p-4  border  rounded-lg">
                
                <Text className="text-sm text-gray-700 flex-1">
                  Ücretsiz Kargo (16:00 öncesi siparişler aynı gün kargolanır) / Ücretsiz
                </Text>
            </View>
        </View>
        
        {/* --- 3. ÖDEME --- */}
        <View className="mt-6">
            <Text className="text-lg font-bold mb-3 text-black">3. Ödeme</Text>
            
            {/* SEÇENEK 1: KREDİ KARTI */}
            <View className={`border rounded-xl mb-3 overflow-hidden ${selectedPaymentType === 'credit_card_form' ? 'border-logintext bg-indigo-50/30' : 'border-gray-200'}`}>
                <TouchableOpacity 
                    onPress={() => setSelectedPaymentType('credit_card_form')}
                    className="flex-row items-center p-4"
                >
                    {/* Radyo Buton */}
                    <Feather 
                        name={selectedPaymentType === 'credit_card_form' ? "check-circle" : "circle"} 
                        size={24} 
                        color={selectedPaymentType === 'credit_card_form' ? "#2126AB" : "#9CA3AF"} 
                    />
                    <Text className="ml-3 text-base font-semibold text-black">Kredi Kartı</Text>
                </TouchableOpacity>

                {/* Form Sadece Seçiliyse Görünür */}
                {selectedPaymentType === 'credit_card_form' && (
                    <View className="px-4 pb-4">
                        <CardFormInputs
                            cardNumber={cardNumber} setCardNumber={setCardNumber}
                            cardHolder={cardHolder} setCardHolder={setCardHolder}
                            cardExpire={cardExpire} setCardExpire={setCardExpire}
                            cardCvc={cardCvc} setCardCvc={setCardCvc}
                        />
                    </View>
                )}
            </View>
            
            {/* SEÇENEK 2: KAPIDA NAKİT */}
            <TouchableOpacity 
                onPress={() => setSelectedPaymentType('cash_on_delivery_cash')}
                className={`flex-row items-center justify-between p-4 border rounded-xl mb-3 ${selectedPaymentType === 'cash_on_delivery_cash' ? 'border-logintext bg-indigo-50/30' : 'border-gray-200'}`}
            >
                <View className="flex-row items-center">
                    <Feather 
                        name={selectedPaymentType === 'cash_on_delivery_cash' ? "check-circle" : "circle"} 
                        size={24} 
                        color={selectedPaymentType === 'cash_on_delivery_cash' ? "#2126AB" : "#9CA3AF"} 
                    />
                    <Text className="ml-3 text-base font-semibold text-black">Kapıda Ödeme (Nakit)</Text>
                </View>
                <Text className="text-sm font-bold text-red-500">{CASH_ON_DELIVERY_FEE} TL İşlem Bedeli</Text>
            </TouchableOpacity>

            {/* SEÇENEK 3: KAPIDA KART */}
            <TouchableOpacity 
                onPress={() => setSelectedPaymentType('cash_on_delivery_card')}
                className={`flex-row items-center justify-between p-4 border rounded-xl mb-3 ${selectedPaymentType === 'cash_on_delivery_card' ? 'border-logintext bg-indigo-50/30' : 'border-gray-200'}`}
            >
                <View className="flex-row items-center">
                    <Feather 
                        name={selectedPaymentType === 'cash_on_delivery_card' ? "check-circle" : "circle"} 
                        size={24} 
                        color={selectedPaymentType === 'cash_on_delivery_card' ? "#2126AB" : "#9CA3AF"} 
                    />
                    <Text className="ml-3 text-base font-semibold text-black">Kapıda Ödeme (Kredi Kartı)</Text>
                </View>
                <Text className="text-sm font-bold text-red-500">{CASH_ON_DELIVERY_FEE} TL İşlem Bedeli</Text>
            </TouchableOpacity>

            {/* SÖZLEŞME ONAYI */}
            <View className="mt-4 mb-6">
                <TouchableOpacity onPress={() => setIsContractChecked(!isContractChecked)} className="flex-row items-start">
                    <Feather name={isContractChecked ? "check-square" : "square"} size={22} color="#2126AB" /> 
                    <Text className="ml-2 text-xs text-gray-600 flex-1 leading-4">
                        Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum.
                    </Text>
                </TouchableOpacity>
            </View>

            {/* BUTON */}
            <OkInput 
                title={loading ? "SİPARİŞ OLUŞTURULUYOR..." : `ÖDEMEYİ TAMAMLA (${Math.round(finalPrice)} TL)`}
                onPress={handlePlaceOrder}
                disabled={loading}
            />

        </View>
        
        <View className="h-10" /> 
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;