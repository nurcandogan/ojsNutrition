import React from 'react';
import { View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import RatingBar from './RatingBar';

interface Props {
  averageStar: number;
  totalComments: number;
  distribution: number[]; // [5,4,3,2,1]
}

const ReviewSummary = ({ averageStar, totalComments, distribution }: Props) => {
  return (
    <View className="mt-2 px-4 pb-2">
      <Text className="text-[28px] font-extrabold">{(averageStar || 0).toFixed(1)}</Text>

      <View className="flex-row mt-2">
        {[...Array(5)].map((_, i) => (
          <AntDesign
            key={i}
            name={i < Math.floor(averageStar) ? 'star' : 'staro'}
            size={18}
            color="#FDD835"
          />
        ))}
      </View>

      <Text className="text-[12px] mt-1">{totalComments} YORUM</Text>

      <View className="mt-4">
        {[5, 4, 3, 2, 1].map((s, i) => (
          <View key={s} className="flex-row items-center mb-2">
            <Text className="w-6 text-[12px]">{s}</Text>
            <View className="flex-1 mx-2">
              <RatingBar value={distribution[i]} total={Math.max(1, totalComments)} />
            </View>
            <Text className="w-10 text-right text-[12px] text-neutral-500">
              {distribution[i]}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ReviewSummary;
