import { View, Text, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import BackIcon from '../Svgs/BackIcon'

interface Props{
    onPress : () => void;
    data: any
}

const BackButtonOverlay = ({onPress, data}: Props) => {
  return (
    <View className='items-start mx-5'>
      <Image source={require('../assets/ojslogo2.png')} className='w-32 h-16 ' resizeMode="contain"  />
            <TouchableOpacity className='flex-row gap-2'  onPress={onPress} > 
                  <Text className='text-[16.03px] font-semibold'> <BackIcon/>  {data.name.toUpperCase()} </Text>
            </TouchableOpacity>
    </View>
  )
}

export default BackButtonOverlay