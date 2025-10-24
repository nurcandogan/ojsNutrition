import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import RatingBar from './RatingBar';
import { CommentItem } from '../navigation/services/commentsService';

type Props = {
  comments: CommentItem[];         // parent state'inden gelir
  totalCount?: number;             // ürünün total'i varsa bunu basar, yoksa comments.length
  averageStarOverride?: number;    // ürünün ortalaması varsa bunu basar (yoksa comments'tan hesaplar)
};

function makeDistribution(items: CommentItem[]): number[] {
  // 5,4,3,2,1
  const dist = [0, 0, 0, 0, 0];
  for (const c of items) {
    const idx = 5 - Math.round(c.stars); // 5★ -> 0, 1★ -> 4
    if (idx >= 0 && idx <= 4) dist[idx] += 1;
  }
  return dist;
}

function calcAverage(items: CommentItem[]): number {
  if (!items.length) return 0;
  const sum = items.reduce((a, b) => a + b.stars, 0);
  return sum / items.length;
}

const ReviewSummary = ({ comments, totalCount, averageStarOverride }: Props) => {
  const avg = useMemo(
    () => (typeof averageStarOverride === 'number' ? averageStarOverride : calcAverage(comments)),
    [averageStarOverride, comments]
  );

  const total = useMemo(
    () => (typeof totalCount === 'number' ? totalCount : comments.length),
    [totalCount, comments.length]
  );

  const distribution = useMemo(() => makeDistribution(comments), [comments]);

  return (
    <View className="mt-2 px-4 pb-2">
      {/* Ortalama */}
      <Text className="text-[28px] font-extrabold">{(avg || 0).toFixed(1)}</Text>

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

      {/* Toplam yorum */}
      <Text className="text-[12px] mt-1">{total} YORUM</Text>

      {/* Dağılım barları */}
      <View className="mt-4">
        {[5, 4, 3, 2, 1].map((s, i) => (
          <View key={s} className="flex-row items-center mb-2">
            <Text className="w-6 text-[12px]">{s}</Text>
            <View className="flex-1 mx-2">
              <RatingBar value={distribution[i] ?? 0} total={Math.max(1, total)} />
            </View>
            <Text className="w-10 text-right text-[12px] text-neutral-500">
              {distribution[i] ?? 0}
            </Text>
          </View>
        ))}
      </View>

      {/* Yorum listesi — SADECE VARSA göster */}
      {comments.length > 0 && (
        <View className="mt-3">
          {comments.map((c, idx) => {
            const name = [c.first_name, c.last_name].filter(Boolean).join(' ').trim() || 'Anonim';
            return (
              <View
                key={`${c.created_at}-${idx}`}
                className="mb-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200"
              >
                <View className="flex-row items-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <AntDesign
                      key={i}
                      name={i < Math.round(c.stars) ? 'star' : 'staro'}
                      size={16}
                      color="#FDD835"
                    />
                  ))}
                </View>
                <Text className="text-[12px] text-neutral-500">
                  {name} • {new Date(c.created_at).toLocaleDateString()}
                </Text>
                {!!c.title && <Text className="mt-1 font-semibold">{c.title}</Text>}
                {!!c.comment && <Text className="mt-1">{c.comment}</Text>}
                {!!c.aroma && (
                  <Text className="mt-1 text-[12px] text-neutral-500">Aroma: {c.aroma}</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default ReviewSummary;
