import { View, Text, TextInput } from 'react-native'
import React from 'react'

interface PropsLogin{
  label:string;
  value:string;
  onChangeText:(text:string)=>void;
  error?: string          // Hata mesajı opsiyonel eklendi
};

const LoginForm = ({label,value,onChangeText,error} :PropsLogin) => {
  
  return (
    <View className='mb-4 w-[324px] mx-auto'>
      <Text className='ml-2 mt-1 font-medium'>{label}</Text>
      <View className=' mt-2  rounded-md w-[324px] h-[50px] border border-bordergray bg-inputgray' >
        <TextInput className='mx-4 mt-4' value={value} onChangeText={onChangeText} 
        secureTextEntry={label.includes('Şifre')}/>
      </View>
      {/* Hata mesajı */}
      {error && <Text className="text-errortext text-xs  ml-2 mt-2 "  style={{ fontWeight: "500", lineHeight: 18 }}>{error}</Text>}
     
    </View>
  )
}

export default LoginForm;