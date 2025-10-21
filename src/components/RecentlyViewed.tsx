import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { MiniProduct } from '../storage-helper/recentlyViewed';
import ProductCard from './ ProductCard';

// Detail ekranına gidiş için minimal stack tipi
type RootStackParamList = {
  ProductDetail: { slug: string; name?: string };
};

type Props = {
  items: MiniProduct[];                     // Son görüntülenenler listesi
  title?: string;                           // Başlık (opsiyonel)
  emptyText?: string;                       // Liste boşsa mesaj
  routeName?: keyof RootStackParamList;     // Hedef route (default: ProductDetail)
};

// ProductCard'ın beklediği "full" şekle küçük adaptör
type FullProductForCard = {
  id: string;
  name: string;
  short_explanation?: string;
  slug: string;
  comment_count: number;
  average_star: number;
  photo_src: string;
  price_info: {
    profit?: number | null;
    total_price: number;
    discounted_price?: number | null;
    discount_percentage?: number | null;
  };
};

const toFull = (p: MiniProduct): FullProductForCard => ({
  id: p.slug,                 
  name: p.name,
  short_explanation: '',
  slug: p.slug,
  comment_count: 5,
  average_star: 5,
  photo_src: p.photo_src,
  price_info: {
    total_price: p.price,
    discounted_price: null,
    discount_percentage: null,
    profit: null,
  },
});

export default function RecentlyViewed({
  items,
  title = 'SON GÖRÜNTÜLENEN ÜRÜNLER',
  emptyText = 'Henüz liste yok.',
  routeName = 'ProductDetail',
}: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View className="mt-6 px-4">
      <Text className="text-[15px] font-extrabold mb-3">{title}</Text>

      {(!items || items.length === 0) ? (
        <Text className="text-neutral-500">{emptyText}</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.slug}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          renderItem={({ item }) => {
            const product = toFull(item); // adaptör burada, ekranda değil
            return (
              <TouchableOpacity
                className="w-1/2 py-2 h-[344px] mb-6"
                onPress={() => navigation.navigate(routeName as any, { slug: item.slug, name: item.name } as any)}
              >
                <ProductCard product={product} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}
