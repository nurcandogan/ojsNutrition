import React from 'react';
import { View } from 'react-native';

type Props ={
   value: number;    //adet yıldız
   total: number;   //toplam yorum

}

const RatingBar = ({ value, total }: Props) => {
  const width = total ? Math.max(4, (value / total) * 100) : 0;  // minimum genişlik 4% olacak şekilde ayarla dedik çünkü 1 yorumda görünmüyordu 4 kişi vermiş gibi yazdık
  return (
    <View className="w-full h-[10px] bg-ratingBg ">
      <View style={{ width: `${width}%` }} className="h-[10px]  bg-logintext" />
    </View>
  );
};

export default RatingBar;
