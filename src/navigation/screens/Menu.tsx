import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import MenuItem from '../../components/TabsMenu/MenuItem';
import AccountIcon from '../../Svgs/AccountIcon';
import BillIcon from '../../Svgs/BillIcon';
import AdressIcon from '../../Svgs/AdressIcon';
import AboutIcon from '../../Svgs/AboutIcon';
import ContactIcon from '../../Svgs/ContactIcon';
import QuestionIcon from '../../Svgs/QuestionIcon';

const Menu = () => {
  const nav = useNavigation();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <Text className='text-[34.45px] font-bold mt-16 mx-[21px]'>Menü</Text>

         <View className='mt-2 mx-6'>

          <View className='flex-row items-center border-b border-lineColor  '>
             <AccountIcon/>
           <MenuItem label={'Hesap Bilgilerim'} onPress={() => nav.navigate('AccountInfo')}/>
          </View>

           <View className='flex-row items-center border-b border-lineColor  '>
             <BillIcon/>
           <MenuItem label={'Siparişlerim'} onPress={() => nav.navigate('AccountInfo')}/>
           </View>

            <View className='flex-row items-center border-b border-lineColor  '>
              <AdressIcon/>
           <MenuItem label={'Adresim'} onPress={() => nav.navigate('AccountInfo')}/>
            </View>
            
            <View className='flex-row items-center border-b border-lineColor  '>
               <AboutIcon/>
           <MenuItem label={'Hakkımızda'} onPress={() => nav.navigate('AccountInfo')}/>
            </View>
           
           <View className='flex-row items-center border-b border-lineColor  '>
             <ContactIcon/>
           <MenuItem label={'Bize Ulaşın'} onPress={() => nav.navigate('AccountInfo')}/>
           </View>
            
            <View className='flex-row items-center border-b border-lineColor  '>
              <QuestionIcon/>
           <MenuItem label={'S.S.S.'} onPress={() => nav.navigate('AccountInfo')}/>
            </View>
            
         </View>
      </ScrollView>
    </SafeAreaView>
  );

};

export default Menu






/*
const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Token'ı sil
      await AsyncStorage.removeItem('accessToken');
      
      // Uygulamayı yeniden başlat ki login ekranına dönsün
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="mb-8 text-lg">Menü</Text>
      
      <TouchableOpacity 
        onPress={handleLogout}
        className="bg-black py-3 px-6 rounded-md"
      >
        <Text className="text-white font-medium">Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  )
*/ 