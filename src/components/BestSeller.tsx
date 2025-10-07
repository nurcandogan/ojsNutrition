import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { BestSellerProps } from '../navigation/services/bestSeller'
import AntDesign from '@expo/vector-icons/AntDesign'
import { API_BASE_URL } from '@env';

interface Props {
  items: BestSellerProps[];
}

const BestSeller = ({ items }: Props) => {
 
  return (
    <View className=''>
      <Text className='ml-5 font-semibold text-xl mt-6 mb-2'>Top Sellers</Text>
      <View className='flex-row flex-wrap mt-4 px-2'>
        {items.map((item) => {
          
          const hasDiscount = item.price_info.discount_percentage !== null;
          const finalPrice = item.price_info.discounted_price ?? item.price_info.total_price;

          return (
            <View key={item.slug} className='w-1/2 px-2 mb-6'>
              <TouchableOpacity activeOpacity={0.8} className=''
               >
                {/* Image Section */}
                <View className='relative items-center'>
                  <Image 
                    source={{ uri: item.photo_src }}   // Direkt kullanıyoruz burada çünkü serviste URL'yi düzelttik.
                    className='w-[150px] h-[150px] '
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
                <Text className='text-base mt-2 font-bold text-center'  >
                  {item.name.toUpperCase()}
                </Text>

                {/* Short Description */}
                <View className='mt-1 justify-center '>
                  {item.short_explanation && (
                  <Text className='text-[10.13px] text-gray-600 mt-1 text-center '
                  >
                    {item.short_explanation.toUpperCase()}
                  </Text>
                  )}
                </View>

                {/* Rating Section */}
                <View className='items-center mt-3  '>
                  <View className='flex-row'>
                    {[...Array(5)].map((_, i) => (
                      <AntDesign
                        key={i}
                        name={i < Math.floor(item.average_star) ? "star" : "staro"}
                        size={14}
                        color="#Fdd835"
                      />
                    ))}
                  </View>
                  <View className='items-center mt-3'>
                    <Text className='text-black  text-[12.77px] ml-2'>
                    {item.comment_count} Yorum
                  </Text>
                  </View>
                </View>

                {/* Price Section */}
                <View className='flex-row justify-center items-center mt-2'>
                   <Text className='text-lg font-bold'>
                    {finalPrice} TL
                  </Text>

                  {hasDiscount && (
                    <Text className='text-discountText ml-2 font-bold text-[15.75px] line-through mr-2'>
                      {item.price_info.total_price} TL
                    </Text>
                  )}
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