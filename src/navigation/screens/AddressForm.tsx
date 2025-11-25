import { View, Text, SafeAreaView, Alert, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import Input from '../../components/TabsMenu/BizeUlasin/Input';
// 🔥 Servis ve Bileşen Çağrıları
import { AddressProps, fetchAddresses, saveAddress } from '../services/addressService'; 
import AddressCard from '../../components/TabsMenu/Adress/AddressCard';
// Not: useCartStore ve CheckoutSummary ödeme akışı için gerekli olacaktır, 
// ancak sadece adres formunu istediğiniz için bu dosyada dahil edilmemiştir.

const AddressForm = () => {
  const navigation = useNavigation<any>();
  const [adresses, setAdresses] = useState<AddressProps[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- Adres Yönetim State'leri ---
  const [isFormVisible, setIsFormVisible] = useState(false); // Form açık mı? (Yeni Ekle/Düzenle)
  const [addressToEdit, setAddressToEdit] = useState<AddressProps | null>(null); // Düzenlenecek adres

  // --- Form input state'leri ---
  const [adressName, setAdressName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [adress, setAdress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [country] = useState({ cca2: "TR", callingCode: ["90"] });

  // --- Adresleri Çekme İşlevi (addressService.ts'den çağrılır) ---
  const loadAddresses = async () => {
    setLoading(true);
    try {
      // 🔥 Servis çağrısı
      const results = await fetchAddresses();
      setAdresses(results);
      
      // ORİJİNAL MANTIK: Kayıtlı adres yoksa formu otomatik aç
      if (results.length === 0) {
        handleAddNewAddress();
      }

    } catch (error) {
      console.error("Adres kontrolü hatası:", error);
      setAdresses([]);
      handleAddNewAddress();
    } finally {
      setLoading(false);
    }
  };

  // Sayfaya her odaklanıldığında adresleri yeniden çek
  useFocusEffect(useCallback(() => {
    loadAddresses();
  }, []));
  
  // --- Yardımcı Fonksiyonlar ---
  const resetForm = (address?: AddressProps) => {
    setAddressToEdit(address || null);
    setAdressName(address?.title || '');
    setName(address?.first_name || '');
    setSurname(address?.last_name || '');
    setAdress(address?.full_address || '');
    setApartment(''); 
    setCity(address?.region.name || '');
    setDistrict(address?.subregion.name || '');
    setPhoneNumber(address?.phone_number.replace('+90', '') || '');
  };

  const handleAddNewAddress = () => {
    resetForm();
    setIsFormVisible(true);
  }
  
  const handleEditAddress = (address: AddressProps) => {
    resetForm(address);
    setIsFormVisible(true);
  }

  // --- Kaydetme İşlevi (saveAddress servisini çağırır) ---
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

      // 🔥 Servis çağrısı
      await saveAddress(body);

      Alert.alert("Başarılı ", `Adres başarıyla ${addressToEdit ? 'güncellendi' : 'kaydedildi'}.`);
      setIsFormVisible(false); // Formu kapat
      resetForm(); 
      loadAddresses(); // Listeyi güncelle

    } catch (error: any) {
      console.log("Kaydetme Hatası:", error);
      Alert.alert("Hata ", error.message || "Bir sorun oluştu");
    }
    setLoading(false);
  };
  
  // --- HEADER BAŞLIĞI ---
  const headerTitle = isFormVisible 
    ? (addressToEdit ? "Adresi Düzenle" : "Yeni Adres Ekle")
    : "Adreslerim";


  // --- İLK YÜKLEME GÖSTERGESİ ---
  if (loading && adresses.length === 0 && !isFormVisible) {
      return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text className="mt-4 text-gray-600">Adresler yükleniyor...</Text>
        </SafeAreaView>
      );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView 
        className="mb-10"
        // Listeleme modundaysa çekme (pull-to-refresh) aktif
        refreshControl={!isFormVisible && <RefreshControl refreshing={loading} onRefresh={loadAddresses} />}
      >
        
        <BackHeader 
          title={headerTitle}
          onPress={() => isFormVisible ? setIsFormVisible(false) : navigation.goBack()}
        />

        {/* -------------------- ADRES LİSTELEME GÖRÜNÜMÜ -------------------- */}
        {!isFormVisible && (
          <View className="px-4 mt-5">

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[20px] font-semibold">Adreslerim</Text>

              <TouchableOpacity onPress={handleAddNewAddress}>
                <Text className="text-orange-500 font-semibold text-[16px]">Adres Ekle</Text>
              </TouchableOpacity>
            </View>

            {/* 🔥 AddressCard bileşenini çağırıyoruz */}
            {adresses.map((item) => (
              <AddressCard
                key={item.id}
                address={item}
                isSelected={false} 
                onSelect={() => { Alert.alert("Seçim", `${item.title} seçildi.`); }}
                onEdit={() => handleEditAddress(item)} 
              />
            ))}
          </View>
        )}

        {/* -------------------- ADRES EKLEME/DÜZENLEME FORMU GÖRÜNÜMÜ -------------------- */}
        {isFormVisible && (
          <View>

            {/* Adres yoksa uyarı */}
            {adresses.length === 0 && (
              <View className="mx-5 mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <Text className="text-indigo-800 text-sm">
                  Kayıtlı adresiniz yok. Lütfen yeni adres oluşturun.
                </Text>
              </View>
            )}

            <View className="mt-10">
              {/* Input bileşenleri ile form verisi toplanır */}
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