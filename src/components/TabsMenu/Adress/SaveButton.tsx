import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'

const SaveButton = () => {
  return (
    <TouchableOpacity className='bg-black  h-[55px] w-[101.28px] justify-center items-center rounded-[4px] '>  
         <Text className='text-white font-semibold text-[18.13px]'>Kaydet</Text>
    </TouchableOpacity>
  )
}
export default SaveButton