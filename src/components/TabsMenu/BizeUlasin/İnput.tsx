import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import OkInput from './OkInput';

interface InputProps {
  name: string;
  surname: string;
  email: string | null;
  message: string;
}

const İnput = ({name, surname, email, message}:InputProps) => {
  return (
   <View className='mt-10  '>
    <View className=' mb-4  items-center '>
      <TextInput 
       placeholder='İsim *' 
       placeholderTextColor='#A1A1AA'
       className='border px-5 w-[358px] h-[50px] text-sm  border-bordergray bg-commentBg  rounded-[4px]'/>
    </View>

     <View className=' mb-4  items-center '>
      <TextInput 
       placeholder='Soyad' 
       placeholderTextColor='#A1A1AA'
       className='border px-5 w-[358px] h-[50px] text-sm  border-bordergray bg-commentBg  rounded-[4px]'/>
    </View>

     <View className=' mb-4  items-center '>
      <TextInput 
       placeholder='E-Posta ' 
       placeholderTextColor='#A1A1AA'
       className='border px-5 w-[358px] h-[50px] text-sm  border-bordergray bg-commentBg  rounded-[4px]'/>
    </View>
     
      <View className=' mb-4  items-center '>
        <TextInput
       placeholder="Mesaj"
       placeholderTextColor='#A1A1AA'
       multiline 
       className="border px-5 w-[358px] h-[150px] text-sm  border-bordergray bg-commentBg text-[16px]  rounded-[4px]"
       />
      </View>

      <View className='justify-center items-center mt-2'>
        <OkInput title='Gönder' onPress={() => ('')}/>
      </View>
      
   </View>
  )
}

export default İnput