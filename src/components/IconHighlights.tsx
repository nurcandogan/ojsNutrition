import { View, Text } from 'react-native'
import React from 'react'
import CarIcon from '../Svgs/CarIcon'
import GuaranteeIcon from '../Svgs/GuaranteeIcon'
import SafeIcon from '../Svgs/SafeIcon'

const IconHighlights = () => {
  return (
    <View className='flex-row justify-between mt-7 px-4 mx-2'>
      <View className='flex-row gap-2 items-center'>
        <CarIcon/>
        <Text className='text-[9.94px] text-center'>Aynı Gün{'\n'}Ücretsiz Kargo</Text>
      </View>

      <View className='flex-row gap-3 items-center'>
        <SafeIcon/>
        <Text className='text-[9.94px] text-center'>750.000+{'\n'}Mutlu Müşteri</Text>
      </View>

      <View className='flex-row gap-3 items-center'>
        <GuaranteeIcon/>
        <Text className='text-[9.94px]  text-center'>Memnuniyet{'\n'}Garantisi</Text>
      </View>

    </View>
    
  )
}

export default IconHighlights