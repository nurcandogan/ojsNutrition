import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AntDesign from '@expo/vector-icons/AntDesign';
import { API_BASE_URL, MEDIA_BASE_URL } from '@env';

type RootStackParamList = {
  Home: undefined;
  CategoryProducts: { id: string; name: string; slug: string };
  ProductDetail: { id: string };
};

interface Product {
  id: string;
  name: string;
  short_explanation: string;
  slug: string;
  comment_count: number;
  average_star: number;
  photo_src: string;
  price_info: {
    total_price: number;
    discounted_price?: number | null;
    discount_percentage?: number | null;
  };
}

const CategoryProducts = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { id, name, slug } = route.params as { id: string; name: string; slug: string };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products?categories=${id}`);
        const data = await response.json();
        const productList = data?.data ?? [];
        setProducts(productList);
      } catch (error) {
        console.error('Ürünleri çekerken hata:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-3">
      <Text className="text-center text-xl font-bold mt-5 mb-4">{name.toUpperCase()}</Text>

      <View className="flex-row flex-wrap justify-between">
        {products.map((product) => {
          const hasDiscount = product.price_info.discount_percentage !== null;
          const finalPrice =
            product.price_info.discounted_price ?? product.price_info.total_price;

          return (
            <TouchableOpacity
              key={product.id}
              onPress={() => navigation.navigate('ProductDetail', { id: product.id })}
              className="w-[48%] bg-white mb-4 rounded-xl border border-gray-200 shadow-sm p-3"
            >
              {/* Ürün görseli */}
              <View className="relative items-center">
                <Image
                  source={{ uri: `${MEDIA_BASE_URL}${product.photo_src}` }}
                  resizeMode="cover"
                  className="w-[150px] h-[150px] rounded-lg"
                />
                {hasDiscount && (
                  <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">
                      %{product.price_info.discount_percentage} İNDİRİM
                    </Text>
                  </View>
                )}
              </View>

              {/* Ürün adı */}
              <Text className="font-bold text-base mt-2 text-center" numberOfLines={1}>
                {product.name.toUpperCase()}
              </Text>

              {/* Kısa açıklama */}
              {product.short_explanation && (
                <Text
                  className="text-gray-500 text-[10.5px] mt-1 text-center"
                  numberOfLines={2}
                >
                  {product.short_explanation.toUpperCase()}
                </Text>
              )}

              {/* Yıldız sistemi */}
              <View className="items-center mt-2">
                <View className="flex-row">
                  {[...Array(5)].map((_, i) => (
                    <AntDesign
                      key={i}
                      name={i < Math.floor(product.average_star) ? 'star' : 'staro'}
                      size={14}
                      color="#Fdd835"
                    />
                  ))}
                </View>
                <Text className="text-[12.5px] text-gray-700 mt-1">
                  {product.comment_count} Yorum
                </Text>
              </View>

              {/* Fiyat kısmı */}
              <View className="flex-row justify-center items-center mt-2">
                <Text className="text-lg font-bold">{finalPrice} TL</Text>
                {hasDiscount && (
                  <Text className="text-gray-400 ml-2 line-through">
                    {product.price_info.total_price} TL
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {products.length === 0 && (
        <Text className="text-center text-gray-500 mt-10">Bu kategoride ürün bulunamadı.</Text>
      )}
    </ScrollView>
  );
};

export default CategoryProducts;
