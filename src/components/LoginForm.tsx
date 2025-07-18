import { View, Text, TextInput } from 'react-native'
import React from 'react'

interface PropsLogin{
  label:string;
  value:string;
  onChangeText:(text:string)=>void;
};

const LoginForm = ({label,value,onChangeText} :PropsLogin) => {
  
  return (
    <View className=''>
      <Text className=' ml-10 font-medium'>{label}</Text>
      <View className='m-10 mt-3  rounded-md w-[324px] h-[50px] border border-bordergray bg-inputgray' >
        <TextInput className='mx-4 mt-4' value={value} onChangeText={onChangeText} 
        secureTextEntry={label.includes('Şifre')}/>
      </View>
     
    </View>
  )
}

export default LoginForm;