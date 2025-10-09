import { View, Text, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';

interface Product {
  id:string;
  name:string;
  short_explanation:string;
  slug:string;
  comment_count:number;
  average_star:number;
  photo_src:string;
  price_info: {
    total_price:number; 
    discount_price?:number;
    discount_percentage?:number;
  }
}

const CategoryProducts = () => {
  const route = useRoute();
  const {id, name, slug} = route.params as {id:string, name:string, slug:string};
  const navigation = useNavigation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchProducts();
 }, [id]);


 const fetchProducts = async() => {
  try {
    const response = await fetch ( `$(API_BASE_URL)/products?categories=${id}`);
    const data = await response.json();
    const productList = data?.data ?? [];
    setProducts(productList);
    setLoading(false);

  } catch (error) {
    console.error('Ürünleri çekerken hata oluştu:', error);
    
  }
 }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }


  return (
    <SafeAreaView>
      <ScrollView>
      <Text>CategoryProducts</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CategoryProducts