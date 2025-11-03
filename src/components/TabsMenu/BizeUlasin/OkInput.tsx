import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type OkInputProps = {
  title?: string;
  onPress?: () => void;
}

const OkInput = ({title, onPress}: OkInputProps) => {
  return (
         <TouchableOpacity className='w-[352px] h-[55px] bg-black items-center justify-center rounded-[4px] '>
            <Text className='text-white text-[18.13px] font-semibold  '>{title}</Text>
          </TouchableOpacity>
  )
}

export default OkInput