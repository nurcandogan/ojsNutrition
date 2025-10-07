import React from 'react';
import { View, Text, TouchableOpacity, Image, ImageBackground, ImageSourcePropType, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Category } from '../navigation/services/categoryService';

type RootStackParamList = {
  Home: undefined;
  CategoryProducts: { id: string; name: string; slug: string };
};

interface CategoryCardProps {
  categories: Category[];
  images: ImageSourcePropType[];
  loading: boolean;
  aminoAcidImage: ImageSourcePropType;
}

const CategoryCard = ({ categories, images, loading, aminoAcidImage }: CategoryCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className='flex-row flex-wrap mt-3'>
      {categories.map((categorie, index) => {
        const isAll = categorie.name === 'TÜM ÜRÜNLER';
        return (
          <View key={categorie.id} className='w-1/2 px-2 mb-4'>
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
                  {categorie.name.replace(' ', '\n')}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CategoryProducts', {
                      id: categorie.id,
                      name: categorie.name,
                      slug: categorie.slug,
                    })
                  }
                  className="bg-black px-4 py-1 rounded-full"
                >
                  <Text className="text-white font-bold text-sm">İNCELE</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        );
      })}
    </View>
  );
};

export default CategoryCard;
