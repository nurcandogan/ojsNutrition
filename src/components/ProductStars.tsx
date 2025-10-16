import { View, Text } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'


interface Props {
  rating: number;
  commentCount: number;
}

const ProductStars = ({ rating, commentCount }: Props) => {
  return (
    
      <View className='items-center mt-1'>
            <View className='flex-row '>
              {[...Array(5)].map((_, index) => (
                <AntDesign 
                      key={index}
                      name={index < Math.floor(rating) ? 'star' : 'staro'}
                      size={17}
                      color="#Fdd835"
                />
              ))}
            </View>
             <Text className="text-[12.5px]  mt-1">
                  {commentCount} Yorum
             </Text>
           </View>
   
  )
}

export default ProductStars