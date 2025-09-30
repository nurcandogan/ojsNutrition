import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { BestSellerProps } from '../navigation/services/bestSeller'
import AntDesign from '@expo/vector-icons/AntDesign'

interface Props {
  items: BestSellerProps[];
}

const BestSeller = ({ items }: Props) => {
  const BASE_HOST = 'https://fe1111.projects.academy.onlyjs.com';

  return (
    <View>
      <Text className='ml-5 font-semibold text-xl mt-6 mb-2'>Top Sellers</Text>
      
      <View className='flex-row flex-wrap mt-4 px-2'>
        {items.map((item) => {
          const imageUri = item.photo_src.startsWith('http')
            ? item.photo_src
            : `${BASE_HOST}${item.photo_src}`;

          const hasDiscount = item.price_info.discount_percentage !== null;
          const finalPrice = item.price_info.discounted_price ?? item.price_info.total_price;

          return (
            <View key={item.slug} className='w-1/2 px-2 mb-6'>
              <TouchableOpacity activeOpacity={0.8}>
                {/* Image Section */}
                <View className='relative'>
                  <Image 
                    source={{ uri: imageUri }}
                    className='w-full h-32 rounded-xl'
                    resizeMode='cover'
                  />
                  {hasDiscount && (
                    <View className='absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full'>
                      <Text className='text-white text-xs font-bold'>
                        %{item.price_info.discount_percentage} İNDİRİM
                      </Text>
                    </View>
                  )}
                </View>

                {/* Product Name */}
                <Text className='text-lg mt-2 font-bold text-center'>
                  {item.name.toUpperCase()}
                </Text>

                {/* Short Description */}
                {item.short_explanation && (
                  <Text className='text-sm text-gray-600 mt-1 text-center'>
                    {item.short_explanation.toUpperCase()}
                  </Text>
                )}

                {/* Rating Section */}
                <View className='flex-row justify-center items-center mt-2'>
                  <View className='flex-row'>
                    {[...Array(5)].map((_, i) => (
                      <AntDesign
                        key={i}
                        name={i < Math.floor(item.average_star) ? "star" : "staro"}
                        size={14}
                        color="#FCD34D"
                      />
                    ))}
                  </View>
                  <Text className='text-gray-500 text-xs ml-2'>
                    {item.comment_count} Yorum
                  </Text>
                </View>

                {/* Price Section */}
                <View className='flex-row justify-center items-center mt-2'>
                  {hasDiscount && (
                    <Text className='text-gray-400 text-sm line-through mr-2'>
                      {item.price_info.total_price} TL
                    </Text>
                  )}
                  <Text className='text-lg font-bold'>
                    {finalPrice} TL
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default BestSeller