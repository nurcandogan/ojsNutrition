import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CommentItem } from '../navigation/services/commentsService';
import RatingBar from './RatingBar';

type Props = {
  comments: CommentItem[];
  totalCount: number;              // toplam kaç yorum var (örn 16)
  averageStarOverride?: number;    // ürünün ortalama puanı (örn 4.8)
  page: number;                    // şu anki sayfa (1,2,3..)
  pageSize: number;                // sayfa başına kaç yorum istiyoruz (10)
  onPageChange: (p: number) => void;
};

function makeDistribution(items: CommentItem[]): number[] {
  // index 0 -> 5 yıldız
  // index 4 -> 1 yıldız
  const dist = [0, 0, 0, 0, 0];
  for (const c of items) {
    const rounded = Math.round(c.stars); // 4.6 -> 5
    const idx = 5 - rounded;             // 5★ -> 0, 1★ -> 4
    if (idx >= 0 && idx <= 4) {
      dist[idx] += 1;
    }
  }
  return dist;
}

function calcAverage(items: CommentItem[]): number {
  if (!items.length) return 0;
  const sum = items.reduce((a, b) => a + (b.stars || 0), 0);
  return sum / items.length;
}

const ReviewSummary = ({
  comments,
  totalCount,
  averageStarOverride,
  page,
  pageSize,
  onPageChange,
}: Props) => {
  const safeComments = Array.isArray(comments) ? comments : [];

  // ortalama yıldız
  const avg = useMemo(() => {
    if (typeof averageStarOverride === 'number') {
      return averageStarOverride || 0;
    }
    return calcAverage(safeComments) || 0;
  }, [averageStarOverride, safeComments]);

  // toplam yorum sayısı (16 gibi)
  const total = totalCount ?? safeComments.length ?? 0;

  // dağılım (sadece bu sayfadaki yorumlardan hesaplıyoruz;
  // istersen backend sana dağılım veriyorsa oraya bağlayabilirsin)
  const distribution = useMemo(
    () => makeDistribution(safeComments),
    [safeComments]
  );

  // kaç sayfa var? örn 16 yorum / 10 per page => 2 sayfa
  const totalPages = Math.max(
    1,
    Math.ceil((total || 0) / (pageSize || 1))
  );

  return (
    <View className="mt-4 px-5 pb-6">
      {/* Ortalama puan */}
      <Text className="text-[28px] font-extrabold">{avg.toFixed(1)}</Text>

      {/* Yıldız ikonları */}
      <View className="flex-row mt-2">
        {[...Array(5)].map((_, i) => (
          <AntDesign
            key={i}
            name={i < Math.floor(avg) ? 'star' : 'staro'}
            size={18}
            color="#FDD835"
          />
        ))}
      </View>

      {/* Toplam yorum adedi */}
      <Text className="text-[12px] mt-1">{total} YORUM</Text>

      {/* Bar dağılımı */}
      <View className="mt-4">
        {[5, 4, 3, 2, 1].map((s, i) => (
          <View key={s} className="flex-row items-center mb-2">
            <Text className="w-6 text-[12px]">{s}</Text>
            <View className="flex-1 mx-2">
              <RatingBar
                value={distribution[i] ?? 0}
                total={Math.max(1, total)}
              />
            </View>
            <Text className="w-10 text-right text-[12px] text-neutral-500">
              {distribution[i] ?? 0}
            </Text>
          </View>
        ))}
      </View>

      {/* Yorum kartları */}
      {safeComments.length > 0 && (
        <View className="mt-4">
          {safeComments.map((c, idx) => {
            const nameParts = [c.first_name, c.last_name].filter(Boolean);
            const displayName =
              nameParts.length > 0 ? nameParts.join(' ') : 'Anonim';

            let dateText = '';
            if (c.created_at) {
              const d = new Date(c.created_at);
              // sabit TR format istersen 'tr-TR' koy.
              dateText = d.toLocaleDateString('tr-TR');
            }

            return (
              <View
                key={`${c.created_at}-${idx}`}
                className="mb-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200"
              >
                {/* yıldızlar */}
                <View className="flex-row items-center mb-1">
                  {[...Array(5)].map((_, i2) => (
                    <AntDesign
                      key={i2}
                      name={i2 < Math.round(c.stars) ? 'star' : 'staro'}
                      size={16}
                      color="#FDD835"
                    />
                  ))}
                </View>

                {/* isim + tarih */}
                <Text className="text-[12px] text-neutral-500">
                  {displayName} • {dateText}
                </Text>

                {/* başlık */}
                {!!c.title && (
                  <Text className="mt-1 font-semibold">{c.title}</Text>
                )}

                {/* asıl yorum */}
                {!!c.comment && <Text className="mt-1">{c.comment}</Text>}

                {/* aroma bilgisi */}
                {!!c.aroma && (
                  <Text className="mt-1 text-[12px] text-neutral-500">
                    Aroma: {c.aroma}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <View className="flex-row items-center justify-center mt-4">
          {/* prev */}
          <TouchableOpacity
            disabled={page <= 1}
            onPress={() => onPageChange(page - 1)}
            className="px-2"
          >
            <Text
              className={`text-[14px] ${
                page <= 1 ? 'text-neutral-400' : 'text-black'
              }`}
            >
              {'<'}
            </Text>
          </TouchableOpacity>

          {/* sayfa numaraları */}
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            const active = pageNum === page;
            return (
              <TouchableOpacity
                key={pageNum}
                onPress={() => onPageChange(pageNum)}
                className="px-2"
              >
                <Text
                  className={`text-[14px] ${
                    active ? 'font-bold text-black' : 'text-neutral-500'
                  }`}
                >
                  {pageNum}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* next */}
          <TouchableOpacity
            disabled={page >= totalPages}
            onPress={() => onPageChange(page + 1)}
            className="px-2"
          >
            <Text
              className={`text-[14px] ${
                page >= totalPages ? 'text-neutral-400' : 'text-black'
              }`}
            >
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ReviewSummary;
