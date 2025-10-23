import { View, Text, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import BasketIcon from '../Svgs/basketIcon';
import ProductPrice from './ProductPrice';

interface Props {
  newPrice: number | null;
  oldPrice: number | null;
  onAddToCart: () => void;

}

const StickyBar = ({newPrice, oldPrice,onAddToCart}:Props) => {
      if (newPrice == null) return null; // fiyat yoksa barı gösterme

      const hasDiscount = !!oldPrice && oldPrice > newPrice;

  return (
    <View className='flex-row  justify-between mx-5 items-center mt-4'>
       <View className='flex-1 items-center justify-center content-center mt-4 ]'>
         <Text className='font-bold text-8xl'>
             <ProductPrice  total={oldPrice ?? newPrice} final={newPrice} hasDiscount={hasDiscount}/>
         </Text>
       </View>


        <TouchableOpacity  activeOpacity={0.8}  className='flex-row gap-2 content-center justify-center items-center bg-black text-white w-[195px] h-[47px] ' onPress={onAddToCart}>
          <BasketIcon/>
          <Text className='text-base  font-bold text-white'>SEPETE EKLE</Text>
        </TouchableOpacity>
    </View>
  )
}

export default StickyBar