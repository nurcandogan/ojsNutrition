import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, NavigationProp } from '@react-navigation/native';
import { MEDIA_BASE_URL } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

type RootStackParamList = {
  ProductDetail: { product: Product };
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

const ProductDetail = () => {
  const route = useRoute();
  const { product } = route.params as { product: Product };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const hasDiscount = !!product?.price_info?.discount_percentage;
  const finalPrice =
    product?.price_info?.discounted_price ?? product?.price_info?.total_price ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-4">
        {/* Ürün görseli */}
        <View className="items-center mt-6">
          <Image
            source={{
              uri: product.photo_src
                ? `${MEDIA_BASE_URL}${product.photo_src}`
                : 'https://via.placeholder.com/300',
            }}
            className="w-[300px] h-[300px] rounded-2xl"
            resizeMode="contain"
          />
          {hasDiscount && (
            <View className="absolute top-2 right-6 bg-red-500 w-[70px] h-[50px] justify-center rounded">
              <Text className="text-white text-center text-[18px] font-bold">
                %{product.price_info.discount_percentage}
              </Text>
              <Text className="text-white text-center text-[11px] -mt-1">İNDİRİM</Text>
            </View>
          )}
        </View>

        {/* Ürün adı */}
        <Text className="text-center text-[22px] font-bold mt-5">
          {product.name.toUpperCase()}
        </Text>

        {/* Kısa açıklama */}
        {product.short_explanation && (
          <Text className="text-center text-gray-600 text-[13px] mt-1">
            {product.short_explanation}
          </Text>
        )}

        {/* Yıldızlar */}
        <View className="items-center mt-3">
          <View className="flex-row">
            {[...Array(5)].map((_, index) => (
              <AntDesign
                key={index}
                name={index < Math.floor(product.average_star) ? 'star' : 'staro'}
                size={20}
                color="#Fdd835"
              />
            ))}
          </View>
          <Text className="text-gray-700 mt-1 text-[13px]">
            {product.comment_count} Yorum
          </Text>
        </View>

        {/* Fiyat bilgisi */}
        <View className="flex-col justify-center items-center mt-5">
          <Text className="text-[25px] font-bold">{Math.round(finalPrice)} TL</Text>
          {hasDiscount && (
            <Text className="text-[16px] text-red-500 line-through">
              {Math.round(product.price_info.total_price)} TL
            </Text>
          )}
        </View>

        {/* Sepete ekle butonu */}
        <View className="mt-10 mb-12 items-center">
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-black w-[90%] py-4 rounded-2xl"
            onPress={() => console.log('Sepete eklendi:', product.name)}
          >
            <Text className="text-white text-center text-[17px] font-semibold">
              SEPETE EKLE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
