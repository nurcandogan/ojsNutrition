// AddressForm.tsx

import { View, Text, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation } from '@react-navigation/native';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import Input from '../../components/TabsMenu/BizeUlasin/Input';



interface AddressProps {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  phone_number: string;

  country: { id: number; name: string };
  region: { id: number; name: string };
  subregion: { id: number; name: string };
}

const AddressForm = () => {
  const [adressName, setAdressName] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [adress, setAdress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<any>();
  const [adresses, setAdresses] = useState<AddressProps[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [country, setCountry] = useState({
    cca2: "TR",
    callingCode: ["90"],
  });

  useEffect(() => {
    checkAddresses();
  }, []);

  const checkAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/users/addresses?limit=10&offset=0`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const json = await response.json();
      const results = json?.data?.results ?? [];

      setAdresses(results);
      setIsFormVisible(results.length === 0);

    } catch (error) {
      setAdresses([]);
      setIsFormVisible(true);
    }
  };

  const handleSave = async () => {
    if (!adressName || !name || !surname || !adress || !city || !district || !phoneNumber) {
      Alert.alert("Uyarı ⚠️", "Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("access_token");
      if (!token) {
        Alert.alert("Hata", "Oturum bulunamadı");
        return;
      }

      const cleanPhone = phoneNumber.replace(/\D/g, "");

      const body = {
        title: adressName,
        first_name: name,
        last_name: surname,
        country_id: 226,
        region_id: 3495,
        subregion_id: 39395,
        full_address: adress,
        apartment: apartment,
        phone_number: `+90${cleanPhone}`
      };

      const response = await fetch(`${API_BASE_URL}/users/addresses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await response.json();

      if (response.ok) {
        Alert.alert("Başarılı", "Adres kaydedildi");
        await checkAddresses();
        setIsFormVisible(false);
      } else {
        Alert.alert("Hata", json.message || "Adres kaydedilemedi");
      }

    } catch (e) {
      Alert.alert("Hata", "Bir sorun oluştu");
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mb-10">
        
        <BackHeader 
          title={isFormVisible ? "Adres Ekle" : "Adreslerim"}
          onPress={() => navigation.goBack()}
        />

        {/* --- ADRES LİSTELEME (TRENDYOL TARZI) --- */}
        {!isFormVisible && adresses.length > 0 && (
          <View className="px-4 mt-5">

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[20px] font-semibold">Adreslerim</Text>

              <TouchableOpacity onPress={() => setIsFormVisible(true)}>
                <Text className="text-orange-500 font-semibold text-[16px]">Adres Ekle</Text>
              </TouchableOpacity>
            </View>

            {adresses.map((item, index) => (
              <View
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
              >

                <View className="flex-row justify-between">
                  <Text className="text-orange-500 font-semibold">{item.title}</Text>

                  <TouchableOpacity onPress={() => setIsFormVisible(true)}>
                    <Text className="text-orange-500 font-semibold">Düzenle</Text>
                  </TouchableOpacity>
                </View>

                <Text className="text-[16px] font-semibold mt-2">
                  {item.first_name} {item.last_name}
                </Text>

                <Text className="text-gray-700 mt-1">{item.phone_number}</Text>

                <Text className="text-gray-600 mt-1 leading-5">
                  {item.full_address}
                </Text>

                <Text className="text-gray-900 font-semibold mt-2">
                  {item.region?.name} / {item.country?.name}
                </Text>

              </View>
            ))}
          </View>
        )}

        {/* --- ADRES EKLEME FORMU --- */}
        {isFormVisible && (
          <View>

            {adresses.length === 0 && (
              <View className="mx-5 mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <Text className="text-indigo-800 text-sm">
                  Kayıtlı adresiniz yok. Lütfen yeni adres oluşturun.
                </Text>
              </View>
            )}

            <View className="mt-10">
              <Input title="*Adres Başlığı" value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." />
              <Input title="*Ad" value={name} onChangeText={setName} placeholder="" />
              <Input title="*Soyad" value={surname} onChangeText={setSurname} placeholder="" />
              <Input title="*Adres" value={adress} onChangeText={setAdress} placeholder="" multiline />
              <Input title="Apartman, Daire" value={apartment} onChangeText={setApartment} placeholder="" />
              <Input title="*Şehir" value={city} onChangeText={setCity} placeholder="" />
              <Input title="*İlçe" value={district} onChangeText={setDistrict} placeholder="" />
              <PhoneField value={phoneNumber} onChange={setPhoneNumber} country={country} setCountry={setCountry} />
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
