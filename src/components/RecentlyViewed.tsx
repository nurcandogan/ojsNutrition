import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { MiniProduct } from '../storage-helper/recentlyViewed';
import { useNavigation } from '@react-navigation/native';
import ProductCard from './ ProductCard';

interface RecentlyViewedProps {
  items: MiniProduct[];
}

const RecentlyViewed = ({ items }: RecentlyViewedProps) => {
  const navigation = useNavigation();

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
              <ProductCard 
                product={{
                  id: item.slug,
                  name: item.name,
                  short_explanation: item.short_explanation,
                  slug: item.slug,
                  comment_count: item.comment_count,
                  average_star: item.average_star,
                  photo_src: item.photo_src,
                  price_info: item.price_info
                }} 
              />
            </TouchableOpacity>
          );
        })}
      </View>
      </View>
    </View>
  );
};

export default RecentlyViewed;