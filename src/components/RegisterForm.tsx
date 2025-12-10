import { View, Text } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'


interface PropsRegister{
    label:string;
    value:string;
    onChangeText:(text:string) => void;
    error?: string          // Hata mesajı opsiyonel eklendi
};

const RegisterForm = ({label ,value ,onChangeText , error} :PropsRegister) => {

  return (
    <View className='mb-4 w-[324px] mx-auto'>
      <Text className='ml-2 mt-1 font-medium'>{label}</Text>
      <View className=' mt-2  rounded-md w-[324px] h-[50px] border border-bordergray bg-inputgray'>
        <TextInput className='mx-4 mt-4 '
         value={value} 
         onChangeText={onChangeText}
         autoCapitalize="none"  // İlk harfi asla büyütmez
         keyboardType={label.includes('E-posta') ? 'email-address' : 'default'}/> 
      </View>
      {error && <Text className="text-errortext text-xs mt-2 ml-2"  style={{ fontWeight: "500", lineHeight: 18 }}>{error}</Text>}
    </View>
  )
}

export default RegisterForm