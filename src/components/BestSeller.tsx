import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { BestSellerProps } from '../navigation/services/bestSeller';


interface Props {
  items: BestSellerProps[];
}


const BestSeller = ({items}: Props) => {

  return (
    <>
    <View>
      <Text className=' ml-5 font-semibold text-xl'>Top Sellers</Text>
    </View>

    <View className='flex-row flex-wrap -mx-2 mt-4 px-4'>
      {/* Burada items dizisini kullanarak her bir öğeyi render ediyoruz*/}
      {items.map((item) => {

        // 1) Burada BASE_HOST olarak domain kısmını yaz
          const BASE_HOST = 'https://fe1111.projects.academy.onlyjs.com';

        // 2) Eğer item.photo_src tam URL değilse, başına host'u ekle
           const uri =
           item.photo_src.startsWith('http')
           ? item.photo_src
            : `${BASE_HOST}${item.photo_src}`;
  
       return (
        <View key={item.slug} className='w-1/2 px-2 mb-6'>
          <TouchableOpacity activeOpacity={0.8} >
            <View className='relative'>
              <Image source={{uri}}
              className='w-full h-32 rounded-xl'
              resizeMode='cover'/>
            
             {item.price_info.discount_percentage != null && (
              <View className='absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full'>
                <Text className='text-white text-xs font-bold'>
                  %{item.price_info.discount_percentage} İNDİRİM
                </Text>
              </View>
              )}

            </View>
            <Text className=' text-lg mt-2 font-bold text-base text-center'>
              {item.name.toUpperCase()}
            </Text>

            {item.short_explanation && (
              <Text className='text-sm text-gray-600 mt-1 text-center'>
                {item.short_explanation.toUpperCase()}
              </Text>
            )}

            <View className='flex-row justify-center items-center mt-2'>
              <Text className=' text-yellow-400 '>
                {'*'.repeat(Math.floor(item.average_star))} 
              </Text>
              <Text className='text-gray-500 text-xs ml-2'>
                {item.comment_count} Yorum
              </Text>
            </View>

            <View className='flex-row justify-center items-center mt-2'>
              {item.price_info.discounted_price != null && (
                <Text className='text-gray-50 text-sm line-through mr-2'>
                  {item.price_info.total_price} TL
                </Text>
              )}
              <Text className='text-lg font-bold'>
                {item.price_info.discounted_price  ?? item.price_info.total_price } TL
              </Text>
            </View>


          </TouchableOpacity>
            

        </View>
)})}
    </View>










    </>
    
  )
}

export default BestSeller