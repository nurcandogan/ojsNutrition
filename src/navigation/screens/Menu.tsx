import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import MenuItem from '../../components/TabsMenu/SSS/MenuItem';
import AccountIcon from '../../Svgs/AccountIcon';
import BillIcon from '../../Svgs/BillIcon';
import AdressIcon from '../../Svgs/AdressIcon';
import AboutIcon from '../../Svgs/AboutIcon';
import ContactIcon from '../../Svgs/ContactIcon';
import QuestionIcon from '../../Svgs/QuestionIcon';
import Feather from '@expo/vector-icons/Feather';


const Menu = () => {
  const nav = useNavigation<any>();
const handleLogout = async () => {
    try {
      // Token'ı sil
      await AsyncStorage.removeItem('access_token');
      
      // Uygulamayı yeniden başlat ki login ekranına dönsün
      nav.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };




  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <Text className='text-[34.45px] font-bold mt-16 mx-[21px]'>Menü</Text>

         <View className='mt-2 mx-6 px-2 '>

          <View className='flex-row items-center border-b border-lineColor'>
             <View className='w-6 mr-1'><AccountIcon  /></View>
           <MenuItem label={'Hesap Bilgilerim'} onPress={() => nav.navigate('AccountInfo')}/>
          </View>

           <View className='flex-row items-center border-b border-lineColor'>
             <View className='w-6 mr-1'><BillIcon /></View>
           <MenuItem label={'Siparişlerim'} onPress={() => nav.navigate('Orders')}/>
           </View>

            <View className='flex-row items-center border-b border-lineColor'>
              <View className='w-6 mr-1'><AdressIcon  /></View>
           <MenuItem label={'Adresim'} onPress={() => nav.navigate('AddressForm')}/>
            </View>
            
            <View className='flex-row items-center border-b border-lineColor'>
               <View className='w-6 mr-1'><AboutIcon  /></View>
           <MenuItem label={'Hakkımızda'} onPress={() => nav.navigate('AboutUs')}/>
            </View>
           
           <View className='flex-row items-center border-b border-lineColor'>
             <View className='w-6 mr-1'><ContactIcon  /></View>
           <MenuItem label={'Bize Ulaşın'} onPress={() => nav.navigate('ContactUs')}/>
           </View>
            
            <View className='flex-row items-center border-b border-lineColor'>
              <View className='w-6 mr-1'><QuestionIcon  /></View>
           <MenuItem label={'S.S.S.'} onPress={() => nav.navigate('Sss')}/>
            </View>
         </View>

           <View className="mt-3 mx-6 px-2 flex-row items-center">
            <View className='w-6 mr-1'><Feather name="log-out" size={24} color="black" /></View>
            <TouchableOpacity 
              onPress={handleLogout}
              className=" py-3 px-4 rounded-md"
            >
               <Text className="text-[13.63px] font-light">Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  );

};

export default Menu






