import { View, Text } from 'react-native'
import React, { use, useMemo } from 'react'
import { CommentItem } from '../navigation/services/commentsService';

type Props = {
  comments: CommentItem[];
  totalCount: number;              // toplam kaç yorum var (örn 16)
  averageStarOverride?: number;    // ürünün ortalama puanı (örn 4.8)
  page: number;                    // şu anki sayfa (1,2,3..)
  pageSize: number;                // sayfa başına kaç yorum istiyoruz (10)
  onPageChange: (p: number) => void;
};

const makeDistribution = (items:CommentItem[]):number[] => {
   const dist= [0,0,0,0,0];

   for(const c of items) {
    //eğer yıldız puanlama sistemi ileri de değişir 4,5 gibi bir puan verme durumu oluşur ise yuvarlamak için kullanılabilir
    //const rounded = Math.round(c.stars);

     const star = Number(c.stars); // zaten biz service'te Number'a çevirmiştik
     const idx = 5 - star;
    if ( idx >= 0 && idx <= 4) {
      dist[idx] += 1;
    }
   }
   return dist;
}

const calcAverage = (items:CommentItem[]): number => {
  if (!items.length) return 0;
  const sum = items.reduce((a, b) => a + (b.stars || 0), 0);
  return sum / items.length;

}


const ReviewSummary = ({comments, totalCount, averageStarOverride, page, pageSize, onPageChange}:Props) => {
  const safeComments = Array.isArray(comments) ?  comments : [];


 // ortalama yıldız
const avg = useMemo(() => {
if (typeof averageStarOverride === 'number') {
  return averageStarOverride  || 0; 
}
return calcAverage(safeComments) || 0;
}, [averageStarOverride, safeComments]);


  // toplam yorum sayısı (16 gibi)
const total = totalCount ?? safeComments.length ?? 0;


  return (
    <View>
      <Text>ReviewSummary</Text>
    </View>
  )
}

export default ReviewSummary