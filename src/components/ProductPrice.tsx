
import { View, Text } from 'react-native'
import React from 'react'

interface Props {
  total: number;
  final: number;
  hasDiscount: boolean;
}

const ProductPrice = ({total, final, hasDiscount}:Props ) => {
  return (
    <View className='flex-row justify-center items-center mt-2 space-x-2'>
                  <Text className='text-base text-xl'>{Math.round(final)} TL </Text>
                  {hasDiscount && (
                    <Text className='text-[15.75px] text-discountText font-bold  line-through'>
                      {total} TL
                    </Text>
                  )}
                </View>
  )
}

export default ProductPrice