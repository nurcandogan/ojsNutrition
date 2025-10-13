// screens/ProductDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL, MEDIA_BASE_URL } from "@env";

const { width } = Dimensions.get("window");

type RouteParams = {
  productSlug: string;
};

interface Variant {
  id: string;
  aroma: string | null;
  photo_src: string;
  is_available: boolean;
  price: {
    total_price: number;
    discounted_price: number | null;
    discount_percentage: number | null;
  };
  size: {
    pieces: number;
    total_services: number;
  };
}

interface ProductDetail {
  id: string;
  name: string;
  short_explanation: string;
  explanation: {
    usage: string;
    features: string;
    description: string;
  };
  tags: string[];
  variants: Variant[];
  comment_count: number;
  average_star: number;
}

const ProductDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productSlug } = route.params as RouteParams;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${productSlug}`);
        const json = await res.json();
        const data = json.data;
        setProduct(data);
        setSelectedVariant(data.variants[0]); // varsayılan olarak ilk varyant seçili
      } catch (err) {
        console.log("Ürün detay hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetail();
  }, [productSlug]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="black" />
      </View>
    );

  if (!product)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Ürün bulunamadı.</Text>
      </View>
    );

  const price = selectedVariant?.price;
  const imageUrl = `${MEDIA_BASE_URL}${selectedVariant?.photo_src}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ürün Görseli */}
        <Image
          source={{ uri: imageUrl }}
          style={{ width: width, height: width }}
          resizeMode="contain"
        />

        {/* Ürün Bilgileri */}
        <View className="px-4 mt-4">
          <Text className="text-xl font-bold">{product.name}</Text>
          <Text className="text-gray-600 mt-1">{product.short_explanation}</Text>

          {/* Etiketler */}
          <View className="flex-row flex-wrap gap-2 mt-2">
            {product.tags.map((tag, index) => (
              <View
                key={index}
                className="bg-gray-100 border border-gray-300 rounded-full px-3 py-1"
              >
                <Text className="text-gray-700 text-xs">{tag}</Text>
              </View>
            ))}
          </View>

          {/* Fiyat */}
          <View className="mt-4">
            {price?.discounted_price ? (
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-bold text-black">
                  {price.discounted_price} TL
                </Text>
                <Text className="text-gray-400 line-through">
                  {price.total_price} TL
                </Text>
                {price.discount_percentage && (
                  <View className="bg-red-500 rounded px-2 py-1">
                    <Text className="text-white text-xs">
                      %{price.discount_percentage} İNDİRİM
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <Text className="text-lg font-bold text-black">
                {price?.total_price} TL
              </Text>
            )}
          </View>

          {/* Boyut ve Servis */}
          <Text className="text-base font-semibold mt-5 mb-2">BOYUT:</Text>
          <View className="flex-row flex-wrap gap-3">
            {product.variants.map((variant) => (
              <TouchableOpacity
                key={variant.id}
                onPress={() => setSelectedVariant(variant)}
                className={`border-2 rounded-xl px-5 py-3 ${
                  selectedVariant?.id === variant.id
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              >
                <Text className="font-semibold text-black text-center">
                  {variant.size.total_services * 25}G
                </Text>
                <Text className="text-xs text-gray-600 text-center">
                  {variant.size.total_services} servis
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sepete Ekle Butonu */}
          <TouchableOpacity className="bg-black rounded-2xl py-4 mt-6 mb-6">
            <Text className="text-white text-center font-semibold text-lg">
              SEPETE EKLE
            </Text>
          </TouchableOpacity>

          {/* Açıklama Alanları */}
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-base font-bold mb-1">ÖZELLİKLER</Text>
            <Text className="text-gray-700 mb-4">{product.explanation.features}</Text>

            <Text className="text-base font-bold mb-1">BESİN İÇERİĞİ</Text>
            <Text className="text-gray-700 mb-4">
              {product.explanation.description}
            </Text>

            <Text className="text-base font-bold mb-1">KULLANIM ŞEKLİ</Text>
            <Text className="text-gray-700 mb-6">{product.explanation.usage}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
