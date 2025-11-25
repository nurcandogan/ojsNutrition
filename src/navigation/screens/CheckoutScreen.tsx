import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { AddressProps, fetchAddresses } from '../services/addressService';
import Input from '../../components/TabsMenu/BizeUlasin/Input'; 
import { useCartStore } from '../../store/cartStore'; 
import { createOrder } from '../services/orderService';
import OrderSummaryCollapse from '../../components/TabsMenu/Order/OrderSummaryCollapse';
import AddressCard from '../../components/TabsMenu/Adress/AddressCard';
import CheckoutSummary from '../../components/TabsMenu/Order/CheckoutSummary';

const CardInput: React.FC<{ title: string; value: string; onChangeText: (text: string) => void; placeholder?: string; keyboardType?: any; }> = 
  ({ title, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View className="mb-4">
      <Input title={title} value={value} onChangeText={onChangeText} placeholder={placeholder} keyboardType={keyboardType} />
    </View>
);

const SHIPPING_FEE = 20; 
const CASH_ON_DELIVERY_FEE = 30; // Görseldeki 39 TL'ye yakın bir değer kullandık, isterseniz 39 yapabilirsiniz.

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const { getTotalPrice, clearCart, ProductItems } = useCartStore();
  const totalPrice = getTotalPrice(); 

  const [addresses, setAddresses] = useState<AddressProps[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const [selectedPaymentType, setSelectedPaymentType] = useState<'credit_cart' | 'cash_on_delivery'>('credit_cart');
  const [isContractChecked, setIsContractChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpire, setCardExpire] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const paymentFee = selectedPaymentType === 'cash_on_delivery' ? CASH_ON_DELIVERY_FEE : 0;
  
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
    if (selectedPaymentType === 'credit_cart') {
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


  const PaymentOption: React.FC<{ type: 'credit_cart' | 'cash_on_delivery', title: string, fee?: number }> = ({ type, title, fee }) => (
    <TouchableOpacity
      onPress={() => setSelectedPaymentType(type)}
      className={`flex-row justify-between items-center p-4 border rounded-lg mb-3 ${
        selectedPaymentType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
      }`}
    >
      <View className="flex-row items-center">
        <Feather name={selectedPaymentType === type ? "check-circle" : "circle"} size={20} color="#4F46E5" />
        <Text className="ml-3 text-base font-semibold">{title}</Text>
      </View>
      {fee !== undefined && fee > 0 && <Text className="text-sm font-bold text-gray-700">{fee} TL</Text>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <BackHeader title="Satın Al / Ödeme" onPress={() => navigation.goBack()} />

      {/* --- ÜRÜN ÖZETİ (COLLAPSIBLE) --- */}
      <OrderSummaryCollapse
          totalAmount={totalPrice}
          itemCount={ProductItems.reduce((sum, item) => sum + item.quantity, 0)}
          paymentFee={paymentFee}
          shipmentFee={SHIPPING_FEE}
      />

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* --- 1. ADRES BİLGİLERİ --- */}
        <Text className="text-lg font-bold mt-4 mb-3">Teslimat Adresi</Text>
        
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            isSelected={address.id === selectedAddressId}
            onSelect={() => setSelectedAddressId(address.id)}
            onEdit={() => handleEditAddress(address)}
          />
        ))}

        <TouchableOpacity 
          onPress={() => navigation.navigate('AddressForm', { isNew: true })} 
          className="flex-row items-center border border-dashed border-gray-400 p-4 rounded-lg mt-2 mb-4"
        >
          <Feather name="plus-circle" size={20} color="#4F46E5" />
          <Text className="text-indigo-600 font-semibold ml-3">Yeni Adres Ekle</Text>
        </TouchableOpacity>
        
        {/* --- 2. KARGO SEÇİMİ --- */}
        <Text className="text-lg font-bold mt-6 mb-3">Kargo</Text>
        <View className={`flex-row justify-between items-center p-4 border rounded-lg mb-3 border-indigo-600 bg-indigo-50`}>
          <View className="flex-row items-center">
            <Feather name="check-circle" size={20} color="#4F46E5" />
            <Text className="ml-3 text-base font-semibold">Kargo: {SHIPPING_FEE} TL</Text>
          </View>
          <Text className="text-sm font-bold text-gray-700">{SHIPPING_FEE} TL</Text>
        </View>

        {/* --- 3. ÖDEME SEÇİMİ --- */}
        <Text className="text-lg font-bold mt-6 mb-3">Ödeme</Text>
        
        <PaymentOption type="credit_cart" title="Kredi Kartı / Banka Kartı" />
        <PaymentOption type="cash_on_delivery" title="Kapıda Ödeme" fee={paymentFee} />

        {/* --- KREDİ KARTI FORMU (KOŞULLU) --- */}
        {selectedPaymentType === 'credit_cart' && (
          <View className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-2">
            <CardInput title="Kart Sahibinin Adı Soyadı" value={cardHolder} onChangeText={setCardHolder} placeholder="Ad Soyad" />
            <CardInput title="Kart Numarası" value={cardNumber} onChangeText={setCardNumber} placeholder="XXXX XXXX XXXX XXXX" keyboardType="numeric" />
            <View className="flex-row justify-between gap-3">
              <View className="flex-1">
                <CardInput title="Son Kullanma (AA/YY)" value={cardExpire} onChangeText={setCardExpire} placeholder="AA/YY" keyboardType="numeric" />
              </View>
              <View className="flex-1">
                <CardInput title="CVC" value={cardCvc} onChangeText={setCardCvc} placeholder="XXX" keyboardType="numeric" />
              </View>
            </View>
          </View>
        )}
        
        {/* --- SÖZLEŞME ONAY KISMI --- */}
        <View className="flex-row items-start mt-6 mb-4">
          <TouchableOpacity onPress={() => setIsContractChecked(!isContractChecked)}>
            <Feather name={isContractChecked ? "check-square" : "square"} size={20} color="#4F46E5" /> 
          </TouchableOpacity>
          <Text className="ml-2 flex-1 text-xs leading-5 text-gray-700">
            Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi'ni okudum, onaylıyorum.
          </Text>
        </View>

      </ScrollView>

      {/* --- ALT SABİT ALAN --- */}
      <CheckoutSummary
        totalPrice={totalPrice}
        shipmentFee={SHIPPING_FEE}
        buttonTitle={loading ? "YÜKLENİYOR..." : "SİPARİŞİ TAMAMLA"}
        onButtonPress={handlePlaceOrder}
        disabled={loading || !selectedAddressId || !isContractChecked}
        extraDetail={
            paymentFee > 0 ? (
                <View className="flex-row justify-between mb-1">
                   <Text className="text-sm text-gray-600">Kapıda Ödeme Farkı:</Text>
                   <Text className="text-sm font-semibold text-red-500">{paymentFee} TL</Text>
                </View>
            ) : null
        }
      />
    </SafeAreaView>
  );
};

export default CheckoutScreen;