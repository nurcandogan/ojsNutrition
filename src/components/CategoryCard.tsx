import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'


interface CategoryCardProps {
  image: any;
  title: string;
  onPress: () => void; 
}

const CategoryCard = ({image, title, onPress}:CategoryCardProps ) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="flex-row items-center justify-between bg-gray-200 rounded-xl p-3 m-2 flex-1 min-w-[150px]"
    >
      <View>
         <Image source={image} className='w-12 h-12 rounded-lg' resizeMode='contain' />
         <View className='ml-3 flex-1'>
            <Text className="font-bold text-lg">{title.toUpperCase()}</Text>
         </View>
         <View className='bg-black rounded-xl px-4 py-1'>
          <Text className='font-bold text-white'>İNCELE</Text>
         </View>
      </View>

    </TouchableOpacity>
  )
}

export default CategoryCard;