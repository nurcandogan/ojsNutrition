import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import ProductCard from '../../components/ ProductCard';
import BackButtonOverlay from '../../components/BackButtonOverlay';

interface Product {
  id: string;
  name: string;
  short_explanation: string;
  slug: string;
  comment_count: number;
  average_star: number;
  photo_src: string;
  price_info: {
    profit?: number;
    total_price: number;
    discounted_price?: number;
    discount_percentage?: number;
  };
}

type RootStackParamList = {
  ProductDetail: { slug: string; name?: string };
  CategoryProducts: { id: string; name: string; slug: string };
};

const ProductList = () => {
  const route = useRoute();
  const { id, name } = route.params as { id: string; name: string; slug: string };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?main_category=${id}`);
      const data = await response.json();
      setProducts(data?.data ?? []);
    } catch (error) {
      console.error('Ürünleri çekerken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-[16px]">
          <BackButtonOverlay onPress={()=> navigation.goBack()} data={{ name }}/>
        <Text className="text-center text-[22.5px] font-bold mt-8 mb-2">{name.toUpperCase()}</Text>

        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() => navigation.navigate('ProductDetail', { slug: product.slug, name: product.name })}
              className="w-1/2 py-2 h-[344px] mb-6"
            >
              <ProductCard product={product} />
            </TouchableOpacity>
          ))}
        </View>

        {products.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">Bu kategoride ürün bulunamadı..</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductList;
