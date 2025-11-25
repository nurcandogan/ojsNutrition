import { View, Text, SafeAreaView, Alert, Touchable, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import { useNavigation } from '@react-navigation/native';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import Input from '../../components/TabsMenu/BizeUlasin/Input';
import AddressCard from '../../components/TabsMenu/Adress/AddressCard';



interface AddressProps {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  full_address: string;
  phone_number: string;

  country: {
    id: number;
    name: string;
  };

  region: {
    id: number;
    name: string;
  };

  subregion: {
    id: number;
    name: string;
  };
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
  const [country, setCountry] = useState({
    cca2: "TR",
    callingCode: ["90"],
  });

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const [adresses, setAdresses] = useState<AddressProps[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // 🔥 FORM AÇIK MI?

  
  

  // Sayfa açılınca kayıtlı adres var mı kontrol et
  useEffect(() => {
  
  }, []);
    

  
 const handleSave = async () => {
  if (!adressName || !name || !surname || !adress || !city || !district || !phoneNumber) {
    Alert.alert("Uyarı ", "Lütfen tüm zorunlu alanları doldurun");
    return;
  }

  setLoading(true);
  try {
    const token = await AsyncStorage.getItem("access_token");
    
    if (!token) {
      Alert.alert("Hata ", "Oturum bulunamadı, lütfen giriş yapın");
      setLoading(false);
      return;
    }

     const cleanPhone = phoneNumber.replace(/\D/g, "");
    


    const body = {
      title: adressName,
      first_name: name,        // ✅ name -> first_name
      last_name: surname,      // ✅ surname -> last_name
      country_id: 226,
      region_id: 3495,
      subregion_id: 39395,
      full_address: adress,
      apartment: apartment,
      phone_number: `+90${cleanPhone}`
    };

    console.log("📦 Gönderilen Body:", body);

   

    

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="mb-10">
        
        <BackHeader 
          title={isFormVisible ? "Adres Ekle" : "Adreslerim"}
          onPress={() => navigation.goBack()}
        />

        {/* --- ADRES LİSTELEME --- */}
        {!isFormVisible && adresses.length > 0 && (
          <View className="px-4 mt-5">

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-[20px] font-semibold">Adreslerim</Text>

              <TouchableOpacity onPress={() => setIsFormVisible(true)}>
                <Text className="text-orange-500 font-semibold text-[16px]">Adres Ekle</Text>
              </TouchableOpacity>
            </View>a

            {adresses.map((item, index) => (
             <AddressCard 
             address={undefined}
              isSelected={false}
               onSelect={ } 
               onEdit={ }
               />
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

export default AddressForm