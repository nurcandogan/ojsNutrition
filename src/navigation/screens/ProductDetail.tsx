import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, {  useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { FactItem, fetchProductDetail, NutritionalContent, Variant } from '../services/productService';
import { addRecentlyViewed, getRecentlyViewed, MiniProduct } from '../../storage-helper/recentlyViewed';
import Feather from '@expo/vector-icons/Feather';
import { MEDIA_BASE_URL } from '@env';
import ProductStars from '../../components/ProductStars';
import TagChip from '../../components/TagChip';
import VariantPicker from '../../components/VariantPicker';
import IconHighlights from '../../components/IconHighlights';
import CollapseSection from '../../components/CollapseSection';
import RecentlyViewed from '../../components/RecentlyViewed';
import BackButtonOverlay from '../../components/BackButtonOverlay';
import StickyBar from '../../components/StickyBar';
import { CommentItem, getProductComments } from '../services/commentsService';
import ReviewSummary from '../../components/ReviewSummary';
import { useCartStore } from '../../store/cartStore';
import { addToCartService } from '../services/basketService';



const ProductDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { slug, name } = route.params as { slug: string; name?: string }; 
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAroma, setSelectedAroma] = useState<string | null>(null);        //Seçilen aroma
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);   //Seçilen variant-boyut
  const [recent, setRecent] = useState<MiniProduct[]>([]);   //Son görüntülenenler
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;
  const { addItem, ProductItems } = useCartStore();
  

  const STICKY_H = 76;

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
        id: detail.id,     // kullanmıyoruz ama yazmamız gerek productcard ile uyumlu olması için
        name: detail.name,
        slug: detail.slug,
        short_explanation: detail.short_explanation || undefined,
        photo_src: detail.variants?.[0]?.photo_src || "",
        comment_count: detail.comment_count ?? 0,
        average_star: detail.average_star ?? 0,
        price_info: {
          total_price: variantPrice?.total_price ?? 0,
          discounted_price: variantPrice?.discounted_price ?? null,
          discount_percentage: variantPrice?.discount_percentage ?? null,
          price_per_servings: variantPrice?.price_per_servings ?? null,
        }
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
      discountPct: p.discount_percentage,                                  // indirim yüzdesi
      perServices: p.price_per_servings ?? null,

    };
  }, [selectedVariant]);
  

   // yorumları (ve sayısını) çek
  useEffect(() => {
    const loadComments = async () => {
      if (!slug) return;
      const offset = (page - 1) * pageSize;
      try {
        const { count, results } = await getProductComments(slug, pageSize, offset);
        setComments(results || []);
        setCommentsCount(count || 0);
      } catch (err) {
        console.error('Yorumlar alınırken hata:', err);
        setComments([]);
        setCommentsCount(0);
      }
    };

    loadComments();
  }, [slug, page]); 



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


const handleAddToCart = async () => {
    if (!data || !selectedVariant) return;  

    try {
      // 1. Backend'e Ekle
      await addToCartService(data.id, selectedVariant.id, 1);

      // 2. Telefona Ekle
      addItem({
        productId: data.id,
        productName: data.name,
        slug: data.slug,
        photo_src: data.variants?.[0]?.photo_src || '',
        variant: selectedVariant,
      });
 
      // 3.
      Alert.alert(
            "Sepete Eklendi", 
            `${data.name} sepetinize başarıyla eklendi.`,
            [{ text: "Tamam" }] // İstersen buraya ikinci bir buton ekleyip "Sepete Git" diyebilirsin.
        );

    } catch (error) {
      console.error("Sepet hatası:", error);
    }
  };

  
const ingredients = (
  data?.explanation?.nutritional_content?.ingredients ?? []
) as NutritionalContent['ingredients'];

  return (
    <SafeAreaView className='flex-1 bg-white '>
      <ScrollView contentContainerStyle={{ paddingBottom: STICKY_H + 24 }}>
        <BackButtonOverlay onPress={()=> navigation.goBack()} data={data}/>

          {ProductItems.length > 0 && (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Basket' as never)}
              className="absolute top-12 right-5  shadow-sm"
            >
             <Feather name="shopping-cart" size={24} color="black" />
          
             <View className='absolute top-[-7] right-[-7] bg-discountText rounded-full w-[18px] h-[18px] flex items-center justify-center '>
               <Text className='text-[12px] text-white text-center items-center justify-center '>{ProductItems.length}</Text>
             </View>
           
            </TouchableOpacity>)}


        <Image 
          source={{ uri: `${MEDIA_BASE_URL}${selectedVariant?.photo_src || data.variants?.[0]?.photo_src || ''}` }}
          className='w-[390px] h-[390px] mt-2 ' resizeMode='cover'
        />

        <View className='px-5 mt-4  '>
          <Text className='text-lg font-bold'>{data.name.toUpperCase()} </Text>

          {!!data.short_explanation && (
           <Text className='text-[14.61px] text-shortExplanationText mt-1'>{data.short_explanation} </Text> )}
           
           <View className=' flex-row items-center'>
            <ProductStars detail={true} rating={data.average_star} commentCount={data.comment_count} />
           </View>

           <View className="flex-row flex-wrap mt-2">
            {(data.tags ?? []).map((tag: string, idx: number) => (
              <TagChip key={`${tag}-${idx}`} label={tag} />
            ))}
            </View>

        </View>
        <View className='border-b border-neutral-200 pb-4 mx-3'/>

        <VariantPicker
         aromas={aromas}
         selectedAroma={selectedAroma}
         onSelectAroma={setSelectedAroma}
         sizeOptions={sizeOptionsForAroma}
         selectedVariantId={selectedVariant?.id ?? null}
         onSelectVariant={setSelectedVariant} 
         />
         <IconHighlights />

        <View className='mt-7 px-5'>
          <Text className='text-[13.01px] mb-2 '>Son Kullanma Tarihi: 10.2026</Text>
          <CollapseSection title='ÖZELLİKLER'>
           <Text className='text-s leading-5 ' >
            {data?.explanation?.features  || 'Bilgi yakında eklenecek.'}
           </Text>
          </CollapseSection>

          <CollapseSection title="BESİN İÇERİĞİ">
           {ingredients.length > 0 
             ? ( <View>
                {ingredients.map((ing, idx) => (
                 <Text key={`${ing.aroma ?? 'Aromasız'}-${idx}`} className="text-s leading-5 mb-1">
                  {ing.value}
                 </Text>
                ))}
                 </View>
              ) : (  <Text className="text-[13px]">Bilgi yakında eklenecek.</Text> )}
             
          </CollapseSection>

          <CollapseSection title='KULLANIM ŞEKLİ'>
            <Text className='text-s leading-5'>
              {data?.explanation?.usage  || 'Bilgi yakında eklenecek.'}
            </Text>
          </CollapseSection>
        </View>

        <RecentlyViewed items={recent} />
        
         {/* Yorumlar + dağılım + pagination */}
        <ReviewSummary
          comments={comments}
          totalCount={commentsCount || data.comment_count || 0}
          averageStarOverride={data.average_star ?? 0}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />


      </ScrollView>
      
      <StickyBar
        newPrice={price ? price.final : null}
        oldPrice={price?.old ?? null}
        services={price?.perServices ?? null}
        onAddToCart={handleAddToCart}
       
      />
       
      
    </SafeAreaView>
  )
}

export default ProductDetail

function commentsService(slug: string, arg1: number, arg2: number) {
  throw new Error('Function not implemented.');
}
