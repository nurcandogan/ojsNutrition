import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { use, useEffect, useMemo, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { fetchProductDetail, Variant } from '../services/productService';
import { addRecentlyViewed, getRecentlyViewed, MiniProduct } from '../../storage-helper/recentlyViewed';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env';
import ProductStars from '../../components/ProductStars';
import TagChip from '../../components/TagChip';
import VariantPicker from '../../components/VariantPicker';
import IconHighlights from '../../components/IconHighlights';

const ProductDetail = () => {
  const route = useRoute();
  const { slug, name } = route.params as { slug: string; name?: string }; 
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAroma, setSelectedAroma] = useState<string | null>(null);        //Seçilen aroma
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);   //Seçilen variant-boyut
  const [recent, setRecent] = useState<MiniProduct[]>([]);   //Son görüntülenenler

 const aromas = useMemo(() => 
   [...new Set(( data?.variants ?? []).map((v: Variant) => v.aroma ?? 'Aromasız'))] as string[],
   [data]
 );


  //seçili aromanın varyant listesidir.
 const sizeOptionsForAroma= useMemo(() => {
  if (!data) return [];
  return (data.variants ?? []).filter((v: Variant) => (v.aroma ?? 'Aromasız') === (selectedAroma ?? 'Aromasız'));
   }, 
  [data, selectedAroma]
 ); 

  const STICKY_H = 76;

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  useEffect(() => {
  if (sizeOptionsForAroma.length > 0) {
    setSelectedVariant(sizeOptionsForAroma[0]);
  } else {
    setSelectedVariant(null);
  }
}, [selectedAroma]);


  const fetchProduct = async () => {
    try { 
      setLoading(true);
      const detail = await fetchProductDetail(slug);
      setData(detail);

      const defaultAroma = detail?.variants?.[0]?.aroma ?? 'Aromasız';
      setSelectedAroma(defaultAroma);

      setSelectedVariant(detail?.variants?.find((v: Variant) => (v.aroma ?? 'Aromasız') === defaultAroma) ?? null);
      
      if (detail ) {
        const variantPrice =detail.variants?.[0]?.price;
        const finalPrice = variantPrice ? variantPrice.discounted_price ?? variantPrice.total_price : 0;
        await addRecentlyViewed({
          name: detail.name,
          slug: detail.slug,
          photo_src: detail.variants?.[0]?.photo_src  || "",
          price: Math.round(finalPrice),
        });
        const list = await getRecentlyViewed();
        setRecent(list.filter((x) => x.slug !== detail.slug)); // kendisini hariç tut

      }

    } catch (error) {
      console.error('Ürün detayı alınırken hata oluştu:', error);
      
    } finally {
      setLoading(false);
    }
  }

  const price = useMemo(() => {
    const p = selectedVariant?.price;
    if (!p) return null;
    return {
      final: Math.round((p.discounted_price ?? p.total_price) as number),   // indirimli fiyat varsa onu al, yoksa normal fiyat
      old: p.discount_percentage ? p.total_price : null,                    // indirim % varsa eski fiyat göster, yoksa eski fiyat gösterilmez
      discountPct: p.discount_percentage                                    // indirim yüzdesi

    };
  }, [selectedVariant]);
  

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Feather name="loader" size={28} />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text>Ürün bulunamadı.</Text>
      </SafeAreaView>
    );
  }

   // Yorum dağılımı kaldırıcaz geçici duruyor
    const totalComments = data.comment_count ?? 0;
  const dist = [5, 4, 3, 2, 1].map((s, i) =>
    i === 0 ? Math.round(totalComments * 0.85) :
    i === 1 ? Math.round(totalComments * 0.12) :
    i === 2 ? Math.round(totalComments * 0.02) :
    i === 3 ? Math.max(1, Math.round(totalComments * 0.008)) :
              Math.max(1, Math.round(totalComments * 0.002))
  );


  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView contentContainerStyle={{ paddingBottom: STICKY_H + 24 }}>
        <Image 
          source={{ uri: `${MEDIA_BASE_URL}${selectedVariant?.photo_src || data.variants?.[0]?.photo_src || ''}` }}
          className='w-[390px] h-[390px] ' resizeMode='cover'
        />

        <View className='px-4 mt-4 '>
          <Text className='text-lg font-bold'>  {data.name.toUpperCase()} </Text>

          {!!data.short_explanation && (
           <Text className='text-[14.61px] text-shortExplanationText mt-1'> {data.short_explanation} </Text> )}
           
           <View className='mt-2 flex-row items-center'>
            <ProductStars rating={data.average_star} commentCount={data.comment_count} />
           </View>

           <View className="flex-row flex-wrap mt-2">
            {(data.tags ?? []).map((tag: string, idx: number) => (
              <TagChip key={`${tag}-${idx}`} label={tag} />
            ))}
            </View>

        </View>


        <VariantPicker
         aromas={aromas}
         selectedAroma={selectedAroma}
         onSelectAroma={setSelectedAroma}
         sizeOptions={sizeOptionsForAroma}
         selectedVariantId={selectedVariant?.id ?? null}
         onSelectVariant={setSelectedVariant} 
         />

         <IconHighlights />





 






      </ScrollView>
    </SafeAreaView>
  )
}

export default ProductDetail