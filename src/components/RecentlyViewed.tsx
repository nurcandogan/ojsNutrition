import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { MiniProduct } from '../storage-helper/recentlyViewed';
import { useNavigation,  NavigationProp } from '@react-navigation/native';
import ProductCard from './ ProductCard';


type RootStackParamList = {
    ProductDetail: { slug: string; name: string };

}
interface RecentlyViewedProps {
  items: MiniProduct[];
}

const RecentlyViewed = ({ items }: RecentlyViewedProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View className='mt-8 mb-9 '>
      <View className='px-[16px]'>
      <Text className='text-[18px] font-bold px-4 mb-4'>
        SON GÖRÜNTÜLENEN ÜRÜNLER
      </Text>
      
      <View className="flex-row flex-wrap justify-between ">
        {items.map((item) => {
          return (
            <TouchableOpacity 
              key={item.slug}
              onPress={() => navigation.navigate('ProductDetail',{ slug: item.slug, name: item.name })}
              activeOpacity={0.7}
              className='w-1/2 py-2 h-[344px] mb-6'
            >
           { /* ProductCard'da ki ve son görüntülenenler için yazdıgımız helper servisinin type'ını uyumla hale getirdik. */}
              <ProductCard product={item}/>   

            </TouchableOpacity>
          );
        })}
      </View>
      </View>
    </View>
  );
};

export default RecentlyViewed;