import { View, Text, TouchableOpacity } from 'react-native'
import React, { useMemo } from 'react'
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

// (ortalama puanını hesapla. )   !! averageStarOverride = data.average_stars'ı döneceğiz eğer bu parametre dönmez ise calcAverage çalışacak..
const calcAverage = (items:CommentItem[]): number => {
  if (!items.length) return 0;
  const sum = items.reduce((a, b) => a + (b.stars || 0), 0);
  return sum / items.length;

}


const ReviewSummary = ({comments, totalCount, averageStarOverride, page, pageSize, onPageChange}:Props) => {
  const safeComments = Array.isArray(comments) ?  comments : [];    //hata olmaması için kontrol yapıyoruz.


 // ortalama puan/yıldız
const avg = useMemo(() => {
if (typeof averageStarOverride === 'number') {
  return averageStarOverride  || 0; 
}
return calcAverage(safeComments) || 0;

}, [averageStarOverride, safeComments]);


  // toplam yorum sayısı (16 gibi)
const total = totalCount ?? safeComments.length ?? 0;

// yıldız dağılımı 5-4-3-2-1 
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

         {/* Yorum kartları */}

         {safeComments.length > 0 && (
          <View>
            {safeComments.map((comment,idx) => {
              const nameParts = [comment.first_name, comment.last_name].filter(Boolean);
              const displayName = nameParts.length > 0 ? nameParts.join(' ') : 'Anonim';
              
              let dateText = '';
               if (comment.created_at) {
              const d = new Date(comment.created_at);
              // sabit TR format istersen 'tr-TR' koy.
               dateText = d.toLocaleDateString('tr-TR');
            }
            return(
              <View key={`${comment.created_at}-${idx}`} className="border-b border-gray-300 pb-4 mb-4 mx-4">
                {/* yıldızlar */}
                <View className="flex-row items-center mb-1">
                  {[...Array(5)].map((_, i2) => (
                    <AntDesign
                      key={i2}
                      name={i2 < Math.round(comment.stars) ? 'star' : 'staro'}
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
                {!!comment.title && (
                  <Text className="mt-1 font-semibold">{comment.title}</Text>
                )}

                   {/* asıl yorum */}
                {!!comment.comment && <Text className="mt-1">{comment.comment}</Text>}

                {/* aroma bilgisi */}
                {!!comment.aroma && (
                  <Text className="mt-1 text-[12px] text-neutral-500">
                    Aroma: {comment.aroma}
                  </Text>
                )}

              </View>

            )
            })}
          </View>
         )}
    

    {/* Pagination */}
      {totalPage > 1 && (
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
          {[...Array(totalPage)].map((_, i) => {
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
            disabled={page >= totalPage}
            onPress={() => onPageChange(page + 1)}
            className="px-2"
          >
            <Text
              className={`text-[14px] ${
                page >= totalPage ? 'text-neutral-400' : 'text-black'
              }`}
            >
              {'>'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  )
}

export default ReviewSummary