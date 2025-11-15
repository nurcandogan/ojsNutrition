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
    country: {
      id: number;
      name: string;
    };
  };

  subregion: {
    id: number;
    name: string;
    region: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
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
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const [adresses, setAdresses] = useState<AddressProps[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // 🔥 FORM AÇIK MI?

  
  const [country, setCountry] = useState({
    cca2: "TR",
    callingCode: ["90"],
  });

  // Sayfa açılınca kayıtlı adres var mı kontrol et
  useEffect(() => {
    checkAddresses();
  }, []);

  // Kullanıcının mevcut adreslerini sunucudan çekmek ekranda göstermek için attığımız istek
  const checkAddresses = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/users/addresses?limit=10&offset=0`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const json = await response.json();
      console.log("Adres Kontrolü:", json.data);
       const results = json?.data?.results ?? [];  
      setAdresses(results);

      // Eğer hiç adres yoksa form otomatik açılsın
      setIsFormVisible(results.length === 0);

    } catch (error) {
      console.log("Adres kontrolü hatası:", error);
       setAdresses([]); // hata durumunda boş dizi
       setIsFormVisible(true); // hata durumunda formu aç
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
      Alert.alert("Hata ❌", "Oturum bulunamadı, lütfen giriş yapın");
      setLoading(false);
      return;
    }

     const cleanPhone = phoneNumber.replace(/\D/g, "");
     const phoneFormats = [
      `+90${cleanPhone}`,              // +905551234567
      `+${country.callingCode[0]}${cleanPhone}`, // +905551234567
      `0${cleanPhone}`,                // 05551234567
      cleanPhone,                      // 5551234567
      `90${cleanPhone}`,               // 905551234567
    ];



    const body = {
      title: adressName,
      first_name: name,        // ✅ name -> first_name
      last_name: surname,      // ✅ surname -> last_name
      country_id: 226,
      region_id: 3495,
      subregion_id: 39395,
      full_address: adress,
      apartment: apartment,
      phone_number: phoneFormats[0] // İlk format
    };

    console.log("📦 Gönderilen Body:", body);



// Gönderme isteği
    const response = await fetch(`${API_BASE_URL}/users/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    console.log("🧾 Backend Response:", json);
    console.log("📊 Status Code:", response.status);

    if (response.ok) {
      Alert.alert("Başarılı ", "Adres kaydedildi");
      await checkAddresses(); // Adresleri güncelle
      setIsFormVisible(false); // Formu kapat
    } else if (response.status === 401) {
      Alert.alert("Oturum Hatası ", "Oturumunuz sonlanmış");
      await AsyncStorage.removeItem("access_token");
    } else if (response.status === 400 && json.reason) {
      // Backend'den gelen hata mesajlarını göster
      const errors = Object.values(json.reason).flat().join("\n");
      Alert.alert("Hata ", errors);
    } else {
      Alert.alert("Hata ", json.message || "Adres kaydedilemedi");
    }
  } catch (error) {
    console.log("❌ Kaydetme Hatası:", error);
    Alert.alert("Hata ", "Bir sorun oluştu");
  }
  setLoading(false);
};

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView className='mb-10'>
        <BackHeader onPress={() => navigation.goBack()} title="Adres Oluştur"/>
        
          {!isFormVisible && adresses.length > 0 && (       
            <View>
               <Text>
              mevcut adresleriniz:
              {adresses.map((address:any, index:number) => (
                <Text key={index}>{"\n"}- {address.title}: {address.full_address}</Text>
                
              ))}
             </Text>
             <TouchableOpacity onPress={() =>  setIsFormVisible(true)} className='bg-black h-[55px] w-[200px] justify-center items-center rounded-[4px] mt-10 mx-5'>
              <Text className='text-white font-semibold text-[18.13px]'>Yeni Adres Ekle</Text>
             </TouchableOpacity>
            </View>
             )}
      
        
         {/* Dinamik mesaj */}
        {isFormVisible &&   (
        <View>
          {adresses.length === 0 && (
         <View className='mx-5 mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200'>
            <Text className='text-indigo-800 text-sm'>
               Kayıtlı bir adresiniz yok. Lütfen aşağıdaki kısımdan adres oluşturunuz.
             </Text>
          </View>)}
          
        <View className='mt-10'>
          <Input value={adressName} onChangeText={setAdressName} placeholder="ev, iş vb.." title='*Adres Başlığı' />
          <Input value={name} onChangeText={setName} placeholder='' title='*Ad' />
          <Input value={surname} onChangeText={setSurname} placeholder='' title='*Soyad'/>
          <Input value={adress} onChangeText={setAdress} placeholder='' title='*Adres'/>
          <Input value={apartment} onChangeText={setApartment} placeholder='' title='Apartman, Daire' />
          <Input value={city} onChangeText={setCity} placeholder='' title='*Şehir' />
          <Input value={district} onChangeText={setDistrict} placeholder='' title='*İlçe'/>
          <PhoneField value={phoneNumber} onChange={setPhoneNumber} country={country} setCountry={setCountry} />
        </View>

        <View className='items-end mx-5 mt-14'>
          <SaveButton onPress={handleSave} loading={loading}/>
        </View>
      </View>
        )}
     





       
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddressForm