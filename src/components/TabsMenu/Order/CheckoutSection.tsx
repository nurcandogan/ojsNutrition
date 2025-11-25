// src/components/CheckoutSection.tsx
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';



interface CheckoutSectionProps {
  step: number;
  title: string;
  isCompleted: boolean; // Bu bölüm tamamlandı mı?
  children: React.ReactNode;
  summaryContent?: string; // Tamamlandığında gösterilecek özet metin
  onPress?: () => void; // Başlığa tıklama aksiyonu
}

const CheckoutSection: React.FC<CheckoutSectionProps> = ({ step, title, isCompleted, children, summaryContent, onPress }) => {
  const [isExpanded, setIsExpanded] = useState(!isCompleted); // Tamamlanmadıysa varsayılan olarak açık

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const headerColor = isCompleted ? 'text-gray-600' : 'text-black';
  const iconColor = isCompleted ? '#10B981' : '#4F46E5';
  const iconName = isCompleted ? 'check-circle' : 'circle';

  return (
    <View className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
      <TouchableOpacity onPress={onPress || toggleExpand} className="flex-row items-center justify-between p-4 bg-white">
        <View className="flex-row items-center flex-1">
          <Text className={`text-xl font-bold mr-3 ${headerColor}`}>{step}</Text>
          <Text className={`text-lg font-semibold ${headerColor}`}>{title}</Text>
        </View>

        {isCompleted && summaryContent ? (
          <Text className="text-sm text-gray-500 mr-2">{summaryContent}</Text>
        ) : (
           <Feather name={isExpanded ? "chevron-up" : "chevron-down"} size={24} color="#6B7280" />
        )}
      </TouchableOpacity>

      {/* İçerik Bölümü */}
      {isExpanded && (
        <View className="p-4 pt-0 border-t border-gray-100">
          {children}
        </View>
      )}
    </View>
  );
};

export default CheckoutSection;