import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";

const SWIPE_LIMIT = -80;

export default function SwipeableItem({ children, onDelete }:any) {
  const translateX = useSharedValue(0);
const offsetX = useSharedValue(0);


  const panGesture = Gesture.Pan()
   .onBegin(() => {
    offsetX.value = translateX.value; // Açık konumdan başlasın
  })
  .onUpdate((e) => {
    const newX = offsetX.value + e.translationX;

    // sola kayma: -80 limit
    // sağa kayma: +20 limit
    translateX.value = Math.min(20, Math.max(SWIPE_LIMIT, newX));
  })
  .onEnd(() => {
    if (translateX.value < -40) {
      // açık bırak
      translateX.value = withTiming(SWIPE_LIMIT, { duration: 160 });
    } else {
      // kapat
      translateX.value = withTiming(0, { duration: 160 });
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ width: "100%", overflow: "hidden" }}>
      {/* arka sil butonu */}
      <View
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          height: 90,
          backgroundColor: "#ED2727",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onDelete}>
          <Feather name="trash-2" size={26} color="#fff" />
          <Text className="text-white mt-2 text-center">Sil</Text>
        </TouchableOpacity>
      </View>

      {/* kayan kart */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            animatedStyle,
            { backgroundColor: "white" },
          ]}
        >
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
