import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { fetchAllProduct, AllProduct } from "../services/allProductsService";
import BackButtonOverlay from "../../components/BackButtonOverlay";
import ProductCard from "../../components/ ProductCard";

type RootStackParamList = {
  ProductDetail: { slug: string; name?: string };
};

const AllProducts = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [products, setProducts] = useState<AllProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchAllProduct(200, 0);
    setProducts(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="px-[16px]">
        <BackButtonOverlay onPress={() => navigation.goBack()} data={{ name: "Tüm Ürünler" }} />
        <Text className="text-center text-[22.5px] font-bold mt-8 mb-2">TÜM ÜRÜNLER</Text>

        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              onPress={() =>
                navigation.navigate("ProductDetail", {
                  slug: product.slug,
                  name: product.name,
                })
              }
              className="w-1/2 py-2 h-[344px] mb-6"
            >
              <ProductCard product={product} />
            </TouchableOpacity>
          ))}
        </View>

        {products.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">
            Ürün bulunamadı.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllProducts;
