import { View, Text } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'


interface PropsRegister{
    label:string;
    value:string;
    onChangeText:(text:string) => void;
};

const RegisterForm = ({label ,value ,onChangeText} :PropsRegister) => {

  return (
    <View>
      <Text className='ml-10 font-medium'>{label}</Text>
      <View className='m-10 mt-3  rounded-md w-[324px] h-[50px] border border-bordergray bg-inputgray'>
        <TextInput className='mx-4 mt-4 ' value={value} onChangeText={onChangeText}/> 
      </View>
    </View>
  )
}

export default RegisterForm