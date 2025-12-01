import { View, Text, SafeAreaView, Alert, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import Input from '../../components/TabsMenu/BizeUlasin/Input';
import { AddressProps, fetchAddresses, saveAddress } from '../services/addressService'; 
import AddressCard from '../../components/TabsMenu/Adress/AddressCard';
import { useAddressStore } from '../../store/addressStore';
// 🔥 Store'u import etmeyi unutmayın (Seçimi kaydetmek için)

const AddressForm = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // Route parametrelerini almak için
  
  // PARAMETRE KONTROLÜ: Ödeme sayfasından mı geldik?
  // CheckoutScreen'den { isSelectionMode: true } gönderilecek.
  const isSelectionMode = route.params?.isSelectionMode || false;

  const { selectedAddressId, setSelectedAddressId } = useAddressStore(); // Store kullanımı

  const [adresses, setAdresses] = useState<AddressProps[]>([]);  //Her bir adresin listesi
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false); 
  const [addressToEdit, setAddressToEdit] = useState<AddressProps | null>(null); // Düzenlenen adres

  // ... (Input state'leri aynı: adressName, name, surname vb.) ...
  const [adressName, setAdressName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [adress, setAdress] = useState('');    // full_address
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country] = useState({ cca2: "TR", callingCode: ["90"] });

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const results = await fetchAddresses();
      setAdresses(results);
      if (results.length === 0) {
        handleAddNewAddress();
      }
    } catch (error) {
      setAdresses([]);
      handleAddNewAddress();
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadAddresses();
  }, []));
  
  // --- Yardımcı Fonksiyonlar (resetForm vb.)---
  const resetForm = (item?: AddressProps) => {
    setAddressToEdit(item || null);
    setAdressName(item?.title || '');
    setName(item?.first_name || '');
    setSurname(item?.last_name || '');
    setAdress(item?.full_address || '');
    setApartment(''); 
    setCity(item?.region.name || '');
    setDistrict(item?.subregion.name || '');
    setPhoneNumber(item?.phone_number.replace('+90', '') || '');
  };

  const handleAddNewAddress = () => {
    resetForm();
    setIsFormVisible(true);
  }
  
  const handleEditAddress = (item: AddressProps) => {
    resetForm(item);
    setIsFormVisible(true);
  }

  // 🔥 ADRES SEÇİM FONKSİYONU
  const handleSelectAddress = (item: AddressProps) => {
      // Sadece seçim modundaysak çalışır
      if (isSelectionMode) {
          setSelectedAddressId(item.id); // Store'u güncelle
          setTimeout(() => {navigation.goBack(); 
          }, 350);            // Geri dönmeden önce kısa bir bekle seçilgiğini gör sonra dön
      }
  };
    
  const handleSave = async () => {
     if (!adressName || !name || !surname || !adress || !city || !district || !phoneNumber) {
      Alert.alert("Uyarı ", "Lütfen tüm zorunlu alanları doldurun");
      return;
    }
    setLoading(true);
    try {
      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const body = {
        ...(addressToEdit ? { address_id: addressToEdit.id } : {}), 
        title: adressName,
        first_name: name,
        last_name: surname,
        country_id: addressToEdit?.country.id || 226, 
        region_id: addressToEdit?.region.id || 3495, 
        subregion_id: addressToEdit?.subregion.id || 39395, 
        full_address: adress,
        apartment: apartment,
        phone_number: `+90${cleanPhone}`
      };
      await saveAddress(body);
      Alert.alert("Başarılı ", `Adres başarıyla ${addressToEdit ? 'güncellendi' : 'kaydedildi'}.`);
      setIsFormVisible(false); 
      resetForm(); 
      loadAddresses(); 
    } catch (error: any) {
      Alert.alert("Hata ", error.message || "Bir sorun oluştu");
    }
    setLoading(false);
  };
  
  const headerTitle = isFormVisible 
    ? (addressToEdit ? "Adresi Düzenle" : "Yeni Adres Ekle")
    : "Adreslerim";

  if (loading && adresses.length === 0 && !isFormVisible) {
      return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="mb-10"
        refreshControl={!isFormVisible && <RefreshControl refreshing={loading} onRefresh={loadAddresses} />}
      >
        
        <BackHeader 
          title={headerTitle}
          onPress={() => isFormVisible ? setIsFormVisible(false) : navigation.goBack()}
        />

        {/* --- ADRES LİSTELEME --- */}
        {!isFormVisible && (
          <View className="px-4 mt-5">

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[20px] font-semibold">Adreslerim</Text>
              <TouchableOpacity onPress={handleAddNewAddress}>
                <Text className="text-orange-500 font-semibold text-[16px]">Adres Ekle</Text>
              </TouchableOpacity>
            </View>

            {adresses.map((item) => (
              <AddressCard
                key={item.id}
                address={item}
                
                //  KRİTİK NOKTA: Sadece selectionMode true ise seçilebilir
                isSelectable={isSelectionMode}
                
                // Seçili mi? (Store'daki ID ile karşılaştır)
                isSelected={item.id === selectedAddressId}
                
                // Tıklanınca ne olsun?
                onSelect={() => handleSelectAddress(item)}
                
                onEdit={() => handleEditAddress(item)} 
              />
            ))}
          </View>
        )}

        {/* --- FORM KISMI (AYNI KALACAK) --- */}
        {isFormVisible && (
          <View>
            <View className="mt-10">
              <Input title="*Adres Başlığı" value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." />
              <Input title="*Ad" value={name} onChangeText={setName} placeholder="" />
              <Input title="*Soyad" value={surname} onChangeText={setSurname} placeholder="" />
              <Input title="*Adres" value={adress} onChangeText={setAdress} placeholder="" multiline />
              <Input title="Apartman, Daire" value={apartment} onChangeText={setApartment} placeholder="" />
              <Input title="*Şehir" value={city} onChangeText={setCity} placeholder="" />
              <Input title="*İlçe" value={district} onChangeText={setDistrict} placeholder="" />
              <PhoneField value={phoneNumber} onChange={setPhoneNumber} country={country} setCountry={() => {}} />
            </View>
            <View className="items-end mx-5 mt-14">
              <SaveButton loading={loading} onPress={handleSave} />
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressForm;


