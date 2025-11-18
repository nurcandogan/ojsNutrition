
import { View, Text } from 'react-native'
import React from 'react'

interface Props {
  total: number;
  final: number;
  hasDiscount: boolean;
}

const ProductPrice = ({total, final, hasDiscount}:Props ) => {
  return (
    <View className='flex-row justify-center items-end space-x-2 -mt-7 '>
     <Text className='text-[19.31px]'>{Math.round(final)} TL </Text>
        {hasDiscount && (
      <Text className='text-[15.75px] text-discountText font-bold  line-through'>
         {total} TL
      </Text>
        )}
    </View>
  )
}

export default ProductPrice






/*
import { View, Text } from 'react-native'
import React from 'react'

interface Props {
  total: number;
  final: number;
  hasDiscount: boolean;
}

const ProductPrice = ({total, final, hasDiscount}:Props ) => {
  return (
    <View className='flex-row justify-center items-end space-x-2 mt-3  '>
     <Text className='text-[19.31px]'>{Math.round(final)} TL </Text>
        {hasDiscount && (
      <Text className='text-[15.75px] text-discountText font-bold  line-through'>
         {total} TL
      </Text>
        )}
    </View>
  )
}

export default ProductPrice */