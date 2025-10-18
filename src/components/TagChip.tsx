import { View, Text } from 'react-native'
import React from 'react'

const TagChip = ({label}: {label:string}) => {
  return (
    <View className='bg-tagBg rounded-[24px] px-3 py-4 text-center items-center justify-center mx-1 mb-2'>
      <Text className='text-[10.13px]'>{label}</Text>
    </View>
  )
}

export default TagChip