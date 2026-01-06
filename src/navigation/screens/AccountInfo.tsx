import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// Bileşenler
import Input from '../../components/TabsMenu/BizeUlasin/Input';
import BackHeader from '../../components/TabsMenu/SSS/BackHeader';
import SaveButton from '../../components/TabsMenu/Adress/SaveButton';
import PhoneField from '../../components/TabsMenu/Adress/PhoneField'; // Senin PhoneField bileşenin
import { getMyAccount, updateMyAccount } from '../services/accountService';


const AccountInfo = () => {
  const navigation = useNavigation();

  // State'ler
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isCheck, setIsCheck] = useState(false);

  // Ülke Kodu (Varsayılan TR)
  const [country, setCountry] = useState<any>({
    cca2: 'TR',
    callingCode: ['90']
  });

  const [loading, setLoading] = useState(false);        // Kaydetme butonu için
  const [initialLoading, setInitialLoading] = useState(true); // Sayfa açılışı için

  // Sayfa açılışında verileri çek
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setInitialLoading(true);
    try {
      const data = await getMyAccount();
      
      if (data) {
        setName(data.first_name || '');
        setSurname(data.last_name || '');
        setEmail(data.email || '');

        // Telefon Numarasını Ayrıştırma Mantığı
        // Gelen veri formatı: "+905551234567" -> Inputta görünecek: "5551234567"
        if (data.phone_number) {
            let rawPhone = data.phone_number;
            // Ülke kodunu temizlemeye çalış (Basit yöntem)
            const code = country.callingCode[0];
            if (rawPhone.startsWith(`+${code}`)) {
                rawPhone = rawPhone.replace(`+${code}`, '');
            } else if (rawPhone.startsWith(code)) {
                 rawPhone = rawPhone.replace(code, '');
            }
            // Başındaki 0'ı temizle
            if (rawPhone.startsWith('0')) {
                rawPhone = rawPhone.substring(1);
            }
            setPhone(rawPhone);
        }
      }
    } catch (error: any) {
      console.log(error);
      // Hata olsa bile kullanıcı boş form görebilir, o yüzden alert ile rahatsız etmeyebiliriz
      // veya: Alert.alert("Hata", "Bilgiler yüklenemedi");
    } finally {
      setInitialLoading(false);
    }
  };

  // --- KAYDETME İŞLEMİ (AddressForm Mantığıyla) ---
  const handleSave = async () => {
    // 1. Validasyon
    if (!name || !surname || !email || !phone) {
      Alert.alert("Uyarı", "Lütfen tüm zorunlu alanları doldurun");
      return;
    }
    
    
    
    if (!isCheck) {
        Alert.alert("Uyarı", "Lütfen ticari ileti onayını işaretleyiniz.");
        return;
    }
    

    setLoading(true);
    try {
      // 2. Veriyi Hazırla (Phone temizleme AddressForm'daki gibi)
      const cleanPhone = phone.replace(/\D/g, ""); // Sadece rakamları al
      const callingCode = country.callingCode[0] || '90';
      
      const updateData = {
        first_name: name,
        last_name: surname,
        email: email,
        phone_number: `+${callingCode}${cleanPhone}` // Format: +905551112233
      };

      // 3. Servise Gönder
      await updateMyAccount(updateData);

      Alert.alert("Başarılı", "Bilgileriniz başarıyla güncellendi.");
      // İstersen güncelleme sonrası geri atabilirsin:
      // navigation.goBack();

    } catch (error: any) {
      Alert.alert("Hata", error.message || "Bir sorun oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
        <SafeAreaView className='flex-1 bg-white justify-center items-center'>
            <ActivityIndicator size="large" color="#4F46E5" />
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <BackHeader 
          title='Hesap Bilgilerim'
          onPress={() => navigation.goBack()}
        />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* AD - SOYAD */}
        <View className='flex-row justify-between mt-10 mx-5'>
            <View>
              <Text className=" mb-3 text-[15.88px] font-medium">*Ad</Text>
              <TextInput 
                className='w-[170px] h-[50px] text-sm px-5 border border-bordergray bg-commentBg rounded-[4px]' 
                placeholder='İsim'
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
               <Text className=" mb-3 text-[15.88px] font-medium">*Soyad</Text>
                <TextInput 
                  className='w-[170px] h-[50px] text-sm px-5 border border-bordergray bg-commentBg rounded-[4px]'
                  placeholder='Soyisim'
                  value={surname}
                  onChangeText={setSurname}
                />
            </View>
        </View>

        {/* TELEFON - PhoneField Entegrasyonu */}
        {/* PhoneField içinde mx-5 var, o yüzden burada sarmalayıcı View'da margin kullanmıyoruz */}
        <PhoneField 
            value={phone}
            onChange={setPhone}
            country={country}
            setCountry={setCountry}
        />

        {/* EMAIL */}
        <View className='mt-2'>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder='Email Adresi'
            title='*Email'
          />
        </View>

        {/* ONAY KUTUSU */}
        <View className="mx-5 flex-row items-start mt-4">
            <TouchableOpacity onPress={() => setIsCheck(!isCheck)} className="mt-1">
              <Feather name={isCheck ? "check-square" : "square"} size={20} color={"#2126AB"} />
            </TouchableOpacity>
            <Text className="ml-2 flex-1 text-xs leading-[20px] text-ticaritext">
              Kampanyalardan haberdar olmak için <Text className="underline font-bold text-black ">Ticari Elektronik İleti Onayı </Text> metnini
              okudum, onaylıyorum. Tarafınızdan gönderilecek ticari elektronik iletileri almak istiyorum.
            </Text>
        </View>
  
        {/* KAYDET BUTONU */}
        <View className='justify-end items-end mx-5 mt-14 mb-10'>
            <SaveButton 
                onPress={handleSave}
                loading={loading}
            />
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default AccountInfo;