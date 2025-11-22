import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { MEDIA_BASE_URL } from "@env";
import AntDesign from "@expo/vector-icons/AntDesign";

const SearchResultItem = ({ item, onPress }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-3 "
    >
      <Image
        source={{ uri: `${MEDIA_BASE_URL}${item.photo_src}` }}
        className="w-[108px] h-[108px] "
      />

      <View className="flex-1 ml-3">
        <Text className="font-semibold">{item.name}</Text>

        <Text className="font-bold mt-1">
          {Math.round(item.price_info.discounted_price ?? item.price_info.total_price)} TL
        </Text>
      </View>

      <AntDesign name="right" size={18} color="gray" />
    </TouchableOpacity>
  );
};

export default SearchResultItem;
