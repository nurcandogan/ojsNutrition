import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { use, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { Variant } from '../services/productService';
import { MiniProduct } from '../../storage-helper/recentlyViewed';

const ProductDetail = () => {
  const route = useRoute();
  const { slug, name } = route.params as { slug: string; name?: string }; 
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAroma, setSelectedAroma] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [recent, setRecent] = useState<MiniProduct[]>([]);


  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView>
        <Text>djhgej</Text>












      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductDetail