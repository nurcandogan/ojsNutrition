import { View, Text, SafeAreaView, TextInput } from 'react-native'
import React from 'react'

interface InputProps {
  name: string;
  surname: string;
  email: string | null;
  message: string;
}

const İnput = ({name, surname, email, message}:InputProps) => {
  return (
   <View className='mt-10'>
    <View className=' mb-4  items-center '>
      <TextInput 
       placeholder='İsim *' 
       placeholderTextColor='#A1A1AA'
       className='border px-5 w-[358px] h-[50px] text-sm  border-bordergray bg-commentBg'/>
    </View>

     <View className=' mb-4  items-center '>
      <TextInput 
       placeholder='Soyad' 
       placeholderTextColor='#A1A1AA'
       className='border px-5 w-[358px] h-[50px] text-sm  border-bordergray bg-commentBg'/>
    </View>

     <View className=' mb-4  items-center '>
      <TextInput 
       placeholder='E-Posta ' 
       placeholderTextColor='#A1A1AA'
       className='border px-5 w-[358px] h-[50px] text-sm   border-bordergray bg-commentBg'/>
    </View>
     
      <View className=' mb-4  items-center '>
        <TextInput
       placeholder="Mesaj"
       placeholderTextColor='#A1A1AA'
       multiline 
       className="border px-5 w-[358px] h-[150px] text-sm  border-bordergray bg-commentBg text-[16px]"
 />

      </View>
      
   </View>
  )
}

export default İnput