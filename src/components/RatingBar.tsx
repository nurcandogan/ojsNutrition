import React from 'react';
import { View } from 'react-native';

type Props ={
   value: number;    //adet yıldız
   total: number;   //toplam yorum

}

const RatingBar = ({ value, total }: Props) => {
  const width = total ? Math.max(4, (value / total) * 100) : 0;
  return (
    <View className="w-full h-[10px] bg-neutral-200 rounded">
      <View style={{ width: `${width}%` }} className="h-[10px] rounded bg-black" />
    </View>
  );
};

export default RatingBar;
