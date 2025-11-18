import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { BestSellerProps } from '../navigation/services/bestSeller'
import AntDesign from '@expo/vector-icons/AntDesign'
import { API_BASE_URL } from '@env';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import ProductCard from './ ProductCard';

interface Props {
  items: BestSellerProps[];
}

type RootStackParamList = {
  ProductDetail: { slug: string; name?: string };
};

const BestSeller = ({items}: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
 
  return (
    <View className=''>
      <Text className='ml-5 font-semibold text-xl mt-6 mb-2'>Top Sellers</Text>
      <View className='flex-row flex-wrap mt-4 px-2'>
        {items.map((item) => {
          
        
          return (
            <View key={item.slug} className='w-1/2 px-2 mb-6'>
              <TouchableOpacity activeOpacity={0.8} className='' onPress={() => navigation.navigate('ProductDetail', { slug: item.slug })}
               >
              <ProductCard product={item} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

     p
    </View>
  );
}

export default BestSeller