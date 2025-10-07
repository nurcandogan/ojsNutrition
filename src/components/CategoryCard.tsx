// components/CategoryCard.tsx
import { View, Text, TouchableOpacity, Image, ImageBackground, ImageSourcePropType, ActivityIndicator } from 'react-native'
import React from 'react'
import { Category } from '../navigation/services/categoryService'
import { useNavigation } from '@react-navigation/native';

interface CategoryCardProps {
  categories: Category[];
  images: ImageSourcePropType[];
  loading: boolean;
  aminoAcidImage: ImageSourcePropType;
}

const CategoryCard = ({ categories, images, loading, aminoAcidImage }: CategoryCardProps) => {
  const navigation = useNavigation();
  
  if (loading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className='flex-row flex-wrap mt-3'>
      {categories.map((cat, index) => {
        const isAll = cat.name === 'TÜM ÜRÜNLER';
        return (
          <TouchableOpacity 
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => console.log("Kategori seçildi:", cat.name, cat.slug)}
            className='w-1/2 px-2 mb-4'
          >
            <ImageBackground
              source={images[index] || images[0]}
              className="w-52 h-32 rounded-xl overflow-hidden items-end"
              resizeMode="cover"
            >
              {isAll && (
                <Image
                  source={aminoAcidImage}
                  resizeMode="cover"
                  className="absolute mt-9 left-2 w-20 h-16"
                />
              )}

              <View className='flex-1 justify-center items-center p-4 gap-4 mt-5'>
                <Text className="font-black text-xl text-center leading-tight text-right">
                  {cat.name.replace(' ', '\n')}
                </Text>

                <TouchableOpacity onPress={() =>
                 navigation.navigate('CategoryProducts', {
                slug: cat.slug,
                title: cat.name,
                })} 
                className="bg-black px-4 py-1 rounded-full">
                <Text className="text-white font-bold text-sm">İNCELE</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default CategoryCard;