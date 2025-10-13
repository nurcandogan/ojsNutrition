import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '@env';

const ProductDetail = () => {
  const route = useRoute();
  const { product } = route.params as any; // tip kontrolü basit tuttuk

  const discounted = product.price_info.discounted_price;

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Image
        source={{ uri: `${API_BASE_URL}${product.photo_src}` }}
        className="w-full h-64 rounded-xl"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold mt-5">{product.name}</Text>
      <Text className="text-gray-600 mt-1">{product.short_explanation}</Text>

      <View className="mt-4">
        {discounted ? (
          <View className="flex-row items-baseline gap-2">
            <Text className="text-2xl font-bold text-black">{discounted} TL</Text>
            <Text className="line-through text-gray-400">{product.price_info.total_price} TL</Text>
            {product.price_info.discount_percentage && (
              <Text className="text-red-600 font-bold">
                %{product.price_info.discount_percentage} İNDİRİM
              </Text>
            )}
          </View>
        ) : (
          <Text className="text-2xl font-bold text-black">
            {product.price_info.total_price} TL
          </Text>
        )}
      </View>

      <Text className="text-yellow-500 mt-3">
        ⭐ {product.average_star.toFixed(1)} ({product.comment_count} yorum)
      </Text>

      <TouchableOpacity
        className="bg-black py-4 rounded-xl mt-6"
        onPress={() => alert(`${product.name} sepete eklendi!`)}
      >
        <Text className="text-white text-center font-bold text-lg">SEPETE EKLE</Text>
      </TouchableOpacity>

      <View className="h-10" />
    </ScrollView>
  );
};

export default ProductDetail;
