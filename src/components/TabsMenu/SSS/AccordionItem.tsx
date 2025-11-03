// components/Faq/AccordionItem.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface Props {
  question: string;
  answer: string;
  isOpen: boolean;
  onPress: () => void;
}

const AccordionItem: React.FC<Props> = ({ question, answer, isOpen, onPress }) => {
  return (
    <View className="border-b border-answerBorder mx-2 ">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row justify-between items-center px-4 py-5"
        activeOpacity={0.6}
      >
        <Text className="font-bold text-[14.18px] flex-1 mr-2 ">{question}</Text>
        <View className="w-[12.5px] h-[12.5px]  border-[1px]   items-center justify-center ">
             <Text className="text-[10px] absolute ">{isOpen  ? '-'  : '+'}</Text>
        </View>
       
      </TouchableOpacity>

      {isOpen && (
        <View className="px-4 pb-5 pt-1 ">
          <Text className="text-[12px] text-black">{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default AccordionItem;
