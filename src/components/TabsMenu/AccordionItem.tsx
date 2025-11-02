// components/Faq/AccordionItem.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface Props {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<Props> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <View className="border-b border-lineColor">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row justify-between items-center px-4 py-5"
      >
        <Text className="font-semibold text-[14px] flex-1 mr-2">{question}</Text>
        <Text className="text-[18px]">{isOpen ? '-' : '+'}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="px-4 pb-5 pt-1">
          <Text className="text-[13px] text-gray-600">{answer}</Text>
        </View>
      )}
    </View>
  );
};

export default AccordionItem;
