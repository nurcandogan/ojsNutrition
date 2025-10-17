import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React, { use, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { Variant } from '../services/productService';
import { MiniProduct } from '../../storage-helper/recentlyViewed';

const ProductDetail = () => {
  const route = useRoute();
  const { slug, name } = route.params as { slug: string; name?: string }; 
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAroma, setSelectedAroma] = useState<string | null>(null);        //Seçilen aroma
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);   //Seçilen variant-boyut
  const [recent, setRecent] = useState<MiniProduct[]>([]);   //Son görüntülenenler

 const aromas = useMemo(() => 
   [...new Set(( data?.variants ?? []).map((v: Variant) => v.aroma ?? 'Aromasız'))], 
   [data]
 );

 const sizeOptionsForAroma= useMemo(() => {
  if (!data) return [];
  return (data.variants ?? []).filter((v: Variant) => (v.aroma ?? 'Aromasız') === (selectedAroma ?? 'Aromasız'));
 }, 
 [data, selectedAroma]); 



  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView>
        <Text>djhgej</Text>












      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductDetail