
import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

const AccountInfo = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Token'ı sil
      await AsyncStorage.removeItem('access_token');
      
      // Uygulamayı yeniden başlat ki login ekranına dönsün
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };


  
  
/*
const abs = async () => {
  const token = await AsyncStorage.getItem("access_token");
 const response = await fetch(API_BASE_URL + "/users/my-account", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const json = await response.json();
  console.log("json:", json);
}

useEffect(() => {
  abs();
}, [])
 
*/


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

}

export default AccountInfo