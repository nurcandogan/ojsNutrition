import { View, Text, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import BasketIcon from '../Svgs/basketIcon';

interface Props {
  newPrice: number | null;
  oldPrice: number | null;
  onAddToCart: () => void;
  services: number | null;
}

const StickyBar = ({newPrice, oldPrice, onAddToCart, services}:Props) => {
  return (
    <View className='flex-row  justify-between px-4  items-center mt-4'>
       <View className=' flex-row flex-1 items-start  '>
          <View>
            <Text className='text-[30px] mb-1  font-bold '> {newPrice !== null 
              ? `${newPrice} TL` 
              : '-'} 
            </Text>
            <Text className='mx-2  text-[14.25px]  font-semibold'>{services} TL /Servis </Text>
          </View>
        {oldPrice ? <Text className='text-[15.75px] -mx-7 text-discountText  font-bold mt-5  line-through'> {oldPrice} TL </Text> : null}
       </View>


        <TouchableOpacity activeOpacity={0.8} onPress={onAddToCart} className='flex-row gap-2 content-center justify-center items-center bg-black text-white w-[195px] h-[47px] '>
          <BasketIcon/>
          <Text className='text-base  font-bold text-white'>SEPETE EKLE</Text>
        </TouchableOpacity>
    </View>
  )
}

export default StickyBar


//ProductPrice'ı çağırdım fakat yazı stilleri farklı olduğuğ için uygun olmadı..

