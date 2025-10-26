import { View, Text } from 'react-native'
import React, { use, useMemo } from 'react'
import { CommentItem } from '../navigation/services/commentsService';
import AntDesign from '@expo/vector-icons/AntDesign';
import RatingBar from './RatingBar';

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

const distribution = useMemo(() => 
 makeDistribution(safeComments), 
[safeComments]
);


const totalPage = Math.max(1 , Math.ceil
  ((total || 0) / (pageSize || 1))

);


  return (
    <View>
      <Text className='text-2xl text-center'>{avg.toFixed(1)}</Text>
      
      {/* Yıldız ikonları */}
      <View className="flex-row mt-2 items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <AntDesign
            key={i}
            name={i < Math.floor(avg) ? 'star' : 'staro'}
            size={18}
            color="#FDD835"
          />
        ))}
      </View>

      <Text className='text-base items-center text-center mt-2'> {total} YORUM </Text>


            {/* Bar dağılımı */}

      <View className='mt-4'>
        {[5,4,3,2,1].map((star, idx) => (
          
            <View key={star} className='flex-row items-center mb-1 mx-4'>
              <Text className='w-4 text-sm'>{star}</Text>
              <AntDesign name='star' size={12} color="#FDD835" />
               <View className='flex-1 mx-2'>
                 <RatingBar value={distribution[idx]} total={Math.max(1, total)}/>
               </View>
              <Text className='w-6 text-s '>{distribution[idx] ?? 0}</Text>
            </View>
        ))}
      </View>


    </View>
  )
}

export default ReviewSummary