import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
// Yardımcı Bileşenler
import OrderSummaryCollapse from '../../components/TabsMenu/Order/OrderSummaryCollapse'; 
import CardFormInputs from '../../components/TabsMenu/Order/CardFormInputs'; 
import OkInput from '../../components/TabsMenu/BizeUlasin/OkInput'; 
// Servisler ve Store
import { AddressProps, fetchAddresses } from '../services/addressService';
import { useCartStore } from '../../store/cartStore'; 
import { createOrder } from '../services/orderService'; 
// 🔥 Store'u import etmeyi unutmuyoruz
import { useAddressStore } from '../../store/addressStore';

const SHIPPING_FEE = 0; 
const CASH_ON_DELIVERY_FEE = 39; 

// --- 1. ÖZEL SİYAH CHECKBOX BİLEŞENİ ---
const CustomBlackCheckbox = ({ isChecked, onPress, label, isBoldLabel = false }: { isChecked: boolean, onPress: () => void, label: string | React.ReactNode, isBoldLabel?: boolean }) => (
    <TouchableOpacity onPress={onPress} className="flex-row items-start mb-4">
        <View className={`w-5 h-5 rounded-md items-center justify-center border mr-3 ${isChecked ? 'bg-black border-black' : 'bg-white border-gray-400'}`}>
            {isChecked && <Feather name="check" size={14} color="white" />}
        </View>
        <View className="flex-1">
             {typeof label === 'string' ? (
                 <Text className={`text-sm text-gray-700 ${isBoldLabel ? 'font-bold' : ''}`}>{label}</Text>
             ) : (
                 label
             )}
        </View>
    </TouchableOpacity>
);

// --- 2. ADIM İKONU (SİYAH YUVARLAK) ---
const StepIndicator = ({ step, isCompleted }: { step: number, isCompleted: boolean }) => (
    <View className="w-8 h-8 rounded-full bg-black items-center justify-center mr-3">
        {isCompleted ? (
            <Feather name="check" size={18} color="white" />
        ) : (
            <Text className="text-white font-bold text-lg">{step}</Text>
        )}
    </View>
);

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const { getTotalPrice, clearCart, ProductItems } = useCartStore();
  const totalPrice = getTotalPrice(); 

  //  Seçili adresi buradan alıyoruz
  const { selectedAddressId, setSelectedAddressId } = useAddressStore();  // Store'dan seçili adres ID'si ve setter fonksiyonu

  const [addresses, setAddresses] = useState<AddressProps[]>([]);  // Adres listesi
  
  // Diğer State'ler
  const [selectedPaymentType, setSelectedPaymentType] = useState<'credit_card_form' | 'cash_on_delivery_cash' | 'cash_on_delivery_card'>('credit_card_form');   // Ödeme tipi
  const [isBillingSame, setIsBillingSame] = useState(true);   // Fatura adresi teslimat adresiyle aynı mı?
  const [isContractChecked, setIsContractChecked] = useState(false);  // Sözleşme onay kutusu
  const [loading, setLoading] = useState(false);
  
  // Kart State'leri
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpire, setCardExpire] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const paymentFee = (selectedPaymentType === 'cash_on_delivery_cash' || selectedPaymentType === 'cash_on_delivery_card') ? CASH_ON_DELIVERY_FEE : 0;
  const finalPrice = totalPrice + SHIPPING_FEE + paymentFee;
  
  // Seçili adresi ID'den bul
  const selectedAddress = addresses.find(a => a.id === selectedAddressId);  // Seçili adres objesi
  const itemCount = ProductItems.reduce((sum, item) => sum + item.quantity, 0);  // Toplam ürün adedi

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const fetchedAddresses = await fetchAddresses();
      setAddresses(fetchedAddresses);
      // Eğer Store boşsa ve liste varsa ilkini seç 
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

  const handlePlaceOrder = async () => {
    if (loading) return;
    if (!selectedAddressId) { Alert.alert("Uyarı", "Lütfen bir teslimat adresi seçin."); return; }
    if (!isContractChecked) { Alert.alert("Uyarı", "Lütfen sözleşmeyi onaylayın."); return; }

    let cardDetails = undefined;
    if (selectedPaymentType === 'credit_card_form') {
      if (!cardNumber || !cardHolder || !cardExpire || !cardCvc) {
        Alert.alert("Uyarı", "Lütfen tüm kart bilgilerini eksiksiz doldurun."); return;
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

      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 20 }}>
        
        {/* --- 1. TESLİMAT ADRESİ --- */}
        <View className="mt-4 mb-6">
            <View className="flex-row items-center mb-4">
                <StepIndicator step={1} isCompleted={!!selectedAddressId} />
                <Text className="text-xl font-bold text-black flex-1">Adres</Text>
                
                {!!selectedAddressId && (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('AddressForm', { isSelectionMode: true })}
                    >
                        <Text className="text-gray-600 font-medium">Düzenle</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {/* Adres Özeti */}
            {selectedAddress ? (
                <View className="pl-11">
                    <Text className="text-base text-gray-800 font-medium mb-1">{selectedAddress.first_name} {selectedAddress.last_name}</Text>
                    <Text className="text-sm text-gray-500 mb-1">{selectedAddress.phone_number}</Text>
                    <Text className="text-sm text-gray-500 leading-5">{selectedAddress.full_address}</Text>
                    <Text className="text-sm text-gray-500 mt-1">{selectedAddress.region.name}, {selectedAddress.country.name}</Text>
                </View>
            ) : (
                <TouchableOpacity onPress={() => navigation.navigate('AddressForm', { isSelectionMode: true })} className="pl-11">
                    <Text className="text-indigo-600 font-bold">Bir teslimat adresi ekleyin</Text>
                </TouchableOpacity>
            )}
            
            <View className="h-[1px] bg-gray-100 mt-6 ml-11" />
        </View>

        {/* --- 2. KARGO --- */}
        <View className="mt-4 mb-6">
            <View className="flex-row items-center mb-2">
                <StepIndicator step={2} isCompleted={true} />
                <Text className="text-xl font-bold text-black">Kargo</Text>
            </View>
            
            <View className="pl-11">
                <Text className="text-sm text-gray-800 mb-1">
                    Ücretsiz Kargo (16:00 öncesi siparişler aynı gün kargolanır) / <Text className="text-gray-400">Ücretsiz</Text>
                </Text>
            </View>

            <View className="h-[1px] bg-gray-100 mt-6 ml-11" />
        </View>
        
        {/* --- 3. ÖDEME --- */}
        <View className="mt-4 mb-6">
            <View className="flex-row items-center mb-4">
                <StepIndicator step={3} isCompleted={false} />
                <Text className="text-xl font-bold text-black">Ödeme</Text>
            </View>
            
            {/* Kredi Kartı */}
            <View className={`border rounded-xl mb-3 overflow-hidden ${selectedPaymentType === 'credit_card_form' ? 'border-indigo-600' : 'border-gray-200'}`}>
                <TouchableOpacity 
                    onPress={() => setSelectedPaymentType('credit_card_form')}
                    className="flex-row items-center p-4"
                >
                    <Feather 
                        name={selectedPaymentType === 'credit_card_form' ? "check-circle" : "circle"} 
                        size={24} 
                        color={selectedPaymentType === 'credit_card_form' ? "#4F46E5" : "#D1D5DB"} 
                    />
                    <Text className="ml-3 text-base font-medium text-black">Kredi Kartı</Text>
                </TouchableOpacity>

                {selectedPaymentType === 'credit_card_form' && (
                    <View className="px-4 pb-4">
                        <CardFormInputs
                            cardNumber={cardNumber} setCardNumber={setCardNumber}
                            cardHolder={cardHolder} setCardHolder={setCardHolder}
                            cardExpire={cardExpire} setCardExpire={setCardExpire}
                            cardCvc={cardCvc} setCardCvc={setCardCvc}
                            isMasterpass={false} onToggleMasterpass={() => {}} 
                        />
                    </View>
                )}
            </View>
            
            {/* Kapıda Nakit */}
            <TouchableOpacity 
                onPress={() => setSelectedPaymentType('cash_on_delivery_cash')}
                className={`flex-row items-center justify-between p-4 border rounded-xl mb-3 ${selectedPaymentType === 'cash_on_delivery_cash' ? 'border-indigo-600' : 'border-gray-200'}`}
            >
                <View className="flex-row items-center">
                    <Feather 
                        name={selectedPaymentType === 'cash_on_delivery_cash' ? "check-circle" : "circle"} 
                        size={24} 
                        color={selectedPaymentType === 'cash_on_delivery_cash' ? "#4F46E5" : "#D1D5DB"} 
                    />
                    <View className="ml-3">
                        <Text className="text-base font-medium text-black">Kapıda Ödeme (Nakit)</Text>
                    </View>
                </View>
                <Text className="text-sm font-bold text-gray-800">{CASH_ON_DELIVERY_FEE} TL İşlem Bedeli</Text>
            </TouchableOpacity>

            {/* Kapıda Kredi Kartı */}
            <View className={`border rounded-xl mb-6 ${selectedPaymentType === 'cash_on_delivery_card' ? 'border-indigo-600 bg-gray-50' : 'border-gray-200'}`}>
                <TouchableOpacity 
                    onPress={() => setSelectedPaymentType('cash_on_delivery_card')}
                    className="flex-row items-center justify-between p-4"
                >
                    <View className="flex-row items-center">
                        <Feather 
                            name={selectedPaymentType === 'cash_on_delivery_card' ? "check-circle" : "circle"} 
                            size={24} 
                            color={selectedPaymentType === 'cash_on_delivery_card' ? "#4F46E5" : "#D1D5DB"} 
                        />
                        <View className="ml-3">
                            <Text className="text-base font-medium text-black">Kapıda Ödeme (Kredi Kartı)</Text>
                        </View>
                    </View>
                    <Text className="text-sm font-bold text-gray-800">{CASH_ON_DELIVERY_FEE} TL İşlem Bedeli</Text>
                </TouchableOpacity>
                
                {/* Alt Metin */}
                {selectedPaymentType === 'cash_on_delivery_card' && (
                    <View className="px-12 pb-4">
                        <Text className="text-sm text-gray-700 leading-5">
                            Kargo şirketi tarafından kapıda ödeme hizmet bedeli alınmaktadır.
                        </Text>
                    </View>
                )}
            </View>

            {/* Checkboxlar */}
            <View className="mb-6">
                
                {/* 1. Fatura Adresi */}
                <CustomBlackCheckbox 
                    isChecked={isBillingSame} 
                    onPress={() => setIsBillingSame(!isBillingSame)}
                    label="Fatura adresim teslimat adresimle aynı"
                />

                {/* 2. Sözleşme */}
                <CustomBlackCheckbox 
                    isChecked={isContractChecked} 
                    onPress={() => setIsContractChecked(!isContractChecked)}
                    label={
                        <Text className="text-sm text-gray-700">
                            <Text className="font-bold text-black">Gizlilik Sözleşmesini</Text> ve <Text className="font-bold text-black">Satış Sözleşmesini</Text> okudum, onaylıyorum.
                        </Text>
                    }
                />
            </View>

            {/* Sipariş Butonu */}
            <OkInput 
                title={loading ? "SİPARİŞ OLUŞTURULUYOR..." : `ÖDEMEYİ TAMAMLA (${Math.round(finalPrice)} TL)`}
                onPress={handlePlaceOrder}
                disabled={loading}
            />
            
            <View className="items-center mt-3 mb-6">
                <View className="flex-row items-center">
                    <Feather name="lock" size={12} color="#9CA3AF" />
                    <Text className="text-xs text-gray-400 ml-1">Ödemeler güvenli ve şifrelidir</Text>
                </View>
            </View>

        </View>
        
        <View className="h-10" /> 
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;