import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { MEDIA_BASE_URL } from "@env";
import AntDesign from "@expo/vector-icons/AntDesign";
// Ürün detay servisini import ediyoruz
import { fetchProductDetail, ProductDetailProps } from "../navigation/services/productService";

const SearchResultItem = ({ item, onPress }: any) => {
  const [sizeLabel, setSizeLabel] = useState<string | null>(null);

  // Bileşen ekrana geldiğinde detay bilgisini çek
  useEffect(() => {
    let isMounted = true; // Hafıza sızıntısını önlemek için kontrol

    const loadSizeInfo = async () => {
      // Eğer item içinde zaten size varsa (ileride backend düzelirse) boşuna istek atma. ((şu an güncelde backendden gelmıyor boyut bılgısı bız urunun ayrıntı sayfasından cekıyoruz))
      if (item.size || (item.variants && item.variants.length > 0)) {
         const directLabel = formatSize(item.size || item.variants[0].size);
         if (directLabel && isMounted) setSizeLabel(directLabel);
         return;
      }

      // Detay bilgisini çek
      if (item.slug) {
        const detail = await fetchProductDetail(item.slug);
        
        if (isMounted && detail && detail.variants && detail.variants.length > 0) {
           // İlk varyantın boyutunu al
           const firstVariantSize = detail.variants[0].size;
           const label = formatSize(firstVariantSize);
           setSizeLabel(label);
        }
      }
    };

    loadSizeInfo();

    return () => { isMounted = false; };
  }, [item.slug]);

  // Boyut objesini metne çeviren yardımcı fonksiyon
  const formatSize = (sizeData: any) => {
    if (!sizeData) return null;
    if (sizeData.gram) return `${sizeData.gram}g`;
    if (sizeData.pieces) return `${sizeData.pieces} Adet`; 
    if (sizeData.total_services) return `${sizeData.total_services} Servis`;
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3"
    >
      {/* Resim */}
      <Image
        source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
        className="w-[108px] h-[108px] "
        resizeMode="contain"
      />

      {/* Yazılar */}
      <View className="flex-1 ml-4 justify-center">
        {/* İsim */}
        <Text className="font-semibold text-black text-[15px] mb-2 leading-5" numberOfLines={2}>
          {item.name}
        </Text>

        {/* Fiyat */}
        <Text className="font-semibold text-black mb-2 text-[15px]">
          {Math.round(item.price_info?.discounted_price ?? item.price_info?.total_price ?? 0)} TL
        </Text>

        {/* --- BOYUT ALANI --- */}
        {/* Önce state'deki (çektiğimiz) boyuta bakar, yoksa kısa açıklamayı gösterir */}
        {(sizeLabel || item.short_explanation) && (
           <Text className="text-black text-[15px] ">
             {sizeLabel ? `Boyut: ${sizeLabel}` : item.short_explanation}
           </Text>
        )}
      </View>

      <AntDesign name="right" size={16} color="#1C1B1F" />
    </TouchableOpacity>
  );
};

export default SearchResultItem;