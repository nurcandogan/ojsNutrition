// screens/ProductDetail.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { MEDIA_BASE_URL } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import type { ProductDetail as ProductDetailType, Variant } from '../services/productService';
import { fetchProductDetail } from '../services/productService';
import { addRecentlyViewed, getRecentlyViewed, MiniProduct } from '../../storage-helper/recentlyViewed';


type RootStackParamList = {
  ProductDetail: { slug: string; name?: string };
};

type ProductDetailRoute = RouteProp<RootStackParamList, 'ProductDetail'>;

const Pill = ({ label }: { label: string }) => (
  <View className="bg-neutral-200 rounded-full px-3 py-1 mr-2 mb-2">
    <Text className="text-[12px] font-medium">{label}</Text>
  </View>
);
const Accordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="border-b border-neutral-200">
      <TouchableOpacity className="flex-row justify-between items-center py-4" onPress={() => setOpen(!open)}>
        <Text className="text-[15px] font-semibold">{title}</Text>
        <AntDesign name={open ? 'up' : 'down'} size={16} />
      </TouchableOpacity>
      {open ? <View className="pb-4">{children}</View> : null}
    </View>
  );
};

const RatingBar = ({ value, total }: { value: number; total: number }) => {
  const width = total ? Math.max(4, (value / total) * 100) : 0;
  return (
    <View className="w-full h-[10px] bg-neutral-200 rounded">
      <View style={{ width: `${width}%` }} className="h-[10px] rounded" />
    </View>
  );
};
const ProductDetails = () => {
  const route = useRoute<ProductDetailRoute>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { slug, name: nameFromRoute } = route.params;

  const [data, setData] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  // Seçimler
  const aromas = useMemo(
    () => Array.from(new Set((data?.variants ?? []).map(v => v.aroma ?? 'Aromasız'))),
    [data]
  );
  const [selectedAroma, setSelectedAroma] = useState<string | null>(null);

  const sizeOptionsForAroma = useMemo(() => {
    if (!data) return [];
    return (data.variants ?? []).filter(v => (v.aroma ?? 'Aromasız') === (selectedAroma ?? 'Aromasız'));
  }, [data, selectedAroma]);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  const [recent, setRecent] = useState<MiniProduct[]>([]);

  const STICKY_H = 76;

  useEffect(() => {
    (async () => {
      setLoading(true);
      const detail = await fetchProductDetail(slug);
      setData(detail);
       const defaultAroma = detail?.variants?.[0]?.aroma ?? 'Aromasız';
      setSelectedAroma(defaultAroma);
      setSelectedVariant(detail?.variants?.find(v => (v.aroma ?? 'Aromasız') === defaultAroma) ?? null);
      setLoading(false);

      // recently viewed kaydet + çek
      if (detail) {
        const pv = detail.variants?.[0]?.price;
        const pFinal = pv ? (pv.discounted_price ?? pv.total_price) : 0;
        await addRecentlyViewed({
          slug: detail.slug,
          name: detail.name,
          photo_src: detail.variants?.[0]?.photo_src || '',
          price: Math.round(pFinal),
        });
        const list = await getRecentlyViewed();
        setRecent(list.filter(x => x.slug !== detail.slug)); // kendisini listeleme
      }
    })();
  }, [slug]);

  useEffect(() => {
    if (sizeOptionsForAroma.length > 0) {
      setSelectedVariant(sizeOptionsForAroma[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedAroma]); // eslint-disable-line

  const price = useMemo(() => {
    const p = selectedVariant?.price;
    if (!p) return null;
    return {
      final: Math.round((p.discounted_price ?? p.total_price) as number),
      old: p.discount_percentage ? p.total_price : null,
      discountPct: p.discount_percentage,
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

  // puan dağılımı için sahte, backend gelince değiştir
  const totalComments = data.comment_count ?? 0;
  const dist = [5, 4, 3, 2, 1].map((s, i) =>
    i === 0 ? Math.round(totalComments * 0.85) :
    i === 1 ? Math.round(totalComments * 0.12) :
    i === 2 ? Math.round(totalComments * 0.02) :
    i === 3 ? Math.max(1, Math.round(totalComments * 0.008)) :
              Math.max(1, Math.round(totalComments * 0.002))
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: STICKY_H + 24 }}>
        {/* Üst görsel */}
        <Image
          source={{ uri: `${MEDIA_BASE_URL}${selectedVariant?.photo_src || data.variants?.[0]?.photo_src || ''}` }}
          className="w-full h-[300px]"
          resizeMode="cover"
        />

        {/* Başlık - yıldız - etiketler */}
        <View className="px-4 pt-4">
          <Text className="text-[20px] font-extrabold">{(data.name || nameFromRoute || '').toUpperCase()}</Text>
          {!!data.short_explanation && (
            <Text className="text-neutral-500 mt-1">{data.short_explanation}</Text>
          )}

          <View className="flex-row items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <AntDesign
                key={i}
                name={i < Math.floor(data.average_star) ? 'star' : 'staro'}
                size={16}
                color="#FDD835"
              />
            ))}
            <Text className="ml-2 text-[13px]">{data.comment_count} Yorum</Text>
          </View>

          <View className="flex-row flex-wrap mt-2">
            {(data.tags ?? []).map((t, idx) => (
              <Pill key={`${t}-${idx}`} label={t} />
            ))}
          </View>
        </View>

        {/* AROMA */}
        <View className="mt-4 px-4">
          <Text className="text-[14px] font-bold mb-2">AROMA:</Text>
          <View className="flex-row flex-wrap">
            {aromas.map((a) => {
              const active = (a ?? 'Aromasız') === (selectedAroma ?? 'Aromasız');
              return (
                <TouchableOpacity
                  key={a ?? 'Aromasız'}
                  onPress={() => setSelectedAroma(a)}
                  className={`px-3 py-2 mr-2 mb-2 rounded-lg border ${active ? 'border-black bg-black' : 'border-neutral-300 bg-white'}`}
                >
                  <Text className={`text-[13px] ${active ? 'text-white font-semibold' : 'text-black'}`}>
                    {a ?? 'Aromasız'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* BOYUT */}
        <View className="mt-4 px-4">
          <Text className="text-[14px] font-bold mb-2">BOYUT:</Text>
          <View className="flex-row flex-wrap">
            {sizeOptionsForAroma.map((v) => {
              const active = v.id === selectedVariant?.id;
              const sizeLabel =
                (v.size?.pieces ? `${v.size.pieces}` : '') +
                (v.size?.total_services ? ` / ${v.size.total_services} servis` : '');
              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => setSelectedVariant(v)}
                  className={`px-3 py-2 mr-2 mb-2 rounded-lg border ${active ? 'border-indigo-600' : 'border-neutral-300'}`}
                >
                  <Text className={`text-[13px] ${active ? 'font-semibold' : ''}`}>{sizeLabel || 'Seçenek'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ikon satırı */}
        <View className="mt-3 px-4 flex-row justify-between">
          <View className="items-center">
            <Feather name="truck" size={20} />
            <Text className="text-[11px] mt-1 text-center">Aynı Gün{'\n'}Ücretsiz Kargo</Text>
          </View>
          <View className="items-center">
            <Feather name="smile" size={20} />
            <Text className="text-[11px] mt-1 text-center">750.000+{'\n'}Mutlu Müşteri</Text>
          </View>
          <View className="items-center">
            <Feather name="shield" size={20} />
            <Text className="text-[11px] mt-1 text-center">Memnuniyet{'\n'}Garantisi</Text>
          </View>
        </View>

        {/* Akordeonlar */}
        <View className="mt-6 px-4">
          <Accordion title="ÖZELLİKLER">
            <Text className="text-[13px] leading-5">{data?.explanation?.features || 'Bilgi yakında eklenecek.'}</Text>
          </Accordion>

          <Accordion title="BESİN İÇERİĞİ">
            {data?.explanation?.nutritional_content?.ingredients?.length ? (
              <View>
                {data.explanation.nutritional_content.ingredients.map((ing, i) => (
                  <Text key={i} className="text-[13px] leading-5 mb-1">{ing.value}</Text>
                ))}
              </View>
            ) : (
              <Text className="text-[13px]">Bilgi yakında eklenecek.</Text>
            )}
          </Accordion>

          <Accordion title="KULLANIM ŞEKLİ">
            <Text className="text-[13px] leading-5">{data?.explanation?.usage || 'Bilgi yakında eklenecek.'}</Text>
          </Accordion>
        </View>

        {/* Son görüntülenenler */}
        <View className="mt-6 px-4">
          <Text className="text-[15px] font-extrabold mb-3">SON GÖRÜNTÜLENEN ÜRÜNLER</Text>
          <View className="flex-row flex-wrap -mx-2">
            {recent.map((p) => (
              <View key={p.slug} className="w-1/2 px-2 mb-6">
                <View className="rounded-xl border border-neutral-200 p-3">
                  <Image source={{ uri: `${MEDIA_BASE_URL}${p.photo_src}` }} className="w-full h-[120px] rounded-md" resizeMode="cover" />
                  <Text className="text-[12px] font-semibold mt-2" numberOfLines={2}>{p.name}</Text>
                  <Text className="text-[13px] mt-1">{p.price} TL</Text>
                </View>
              </View>
            ))}
            {recent.length === 0 && <Text className="text-neutral-500">Henüz liste yok.</Text>}
          </View>
        </View>

        {/* Yorumlar özet + liste (placeholder) */}
        <View className="mt-2 px-4 pb-2">
          <Text className="text-[28px] font-extrabold">{(data.average_star || 0).toFixed(1)}</Text>
          <View className="flex-row mt-2">
            {[...Array(5)].map((_, i) => (
              <AntDesign key={i} name={i < Math.floor(data.average_star) ? 'star' : 'staro'} size={18} color="#FDD835" />
            ))}
          </View>
          <Text className="text-[12px] mt-1">{totalComments} YORUM</Text>

          <View className="mt-4">
            {[5, 4, 3, 2, 1].map((s, i) => (
              <View key={s} className="flex-row items-center mb-2">
                <Text className="w-6 text-[12px]">{s}</Text>
                <View className="flex-1 mx-2"><RatingBar value={dist[i]} total={Math.max(1, totalComments)} /></View>
                <Text className="w-10 text-right text-[12px] text-neutral-500">{dist[i]}</Text>
              </View>
            ))}
          </View>

          {/* Örnek yorum kartları (endpoint gelince değiştir) */}
          <View className="mt-4">
            {[...Array(Math.min(5, Math.max(1, Math.ceil(totalComments / 5))))].map((_, idx) => (
              <View key={idx} className="mb-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <View className="flex-row items-center mb-1">
                  {[...Array(5)].map((__, i) => (
                    <AntDesign key={i} name={i < 5 - (idx % 2) ? 'star' : 'staro'} size={16} color="#FDD835" />
                  ))}
                </View>
                <Text className="text-[12px] text-neutral-500">Doğrulanmış Müşteri</Text>
                <Text className="mt-1">Her zamanki kalite. Teşekkürler.</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* HEADER geri */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="absolute left-3 top-3 bg-white/90 rounded-full p-2">
        <AntDesign name="left" size={20} />
      </TouchableOpacity>

      {/* STICKY ALT BAR */}
      <View className="absolute left-0 right-0 bottom-0 mb-9 bg-white border-t border-neutral-200 px-4 py-3 flex-row items-center">
        <View className="flex-1">
          <Text className="text-[22px] font-extrabold">{price ? `${price.final} TL` : '-'}</Text>
          {price?.old ? <Text className="text-neutral-500 line-through">{price.old} TL</Text> : null}
        </View>
        <TouchableOpacity
          onPress={() => {/* sepet entegrasyonu */}}
          className="bg-black w-[195px] h-[47px] px-5 py-3 "
        >
          <Text className="text-white justify-center text-center mt-1 font-bold">SEPETE EKLE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;
