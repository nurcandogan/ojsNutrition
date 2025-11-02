// screens/Sss.tsx
import React, { useState, useMemo } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Category, sssData } from '../../data/sssData';
import { useNavigation } from '@react-navigation/native';
import AccordionItem from '../../components/TabsMenu/AccordionItem';

const tabs: Category[] = ['Genel', 'Ürünler', 'Kargo'];

const Sss: React.FC = () => {
  const nav = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Category>('Genel');
  const [openId, setOpenId] = useState<string | null>(null);

  const questionsByCategory = useMemo(
    () => sssData.filter(q => q.category === activeTab),
    [activeTab]
  );

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-4 mt-4">
          <TouchableOpacity onPress={() => nav.goBack()}>
            <Text className="text-[14px]">◀ S.S.S.</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 mt-4">
          <View className="flex-row space-x-2">
            {tabs.map(tab => {
              const selected = tab === activeTab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => { setActiveTab(tab); setOpenId(null); }}
                  className={`px-4 py-2 rounded ${selected ? 'bg-black' : 'bg-gray-200'}`}
                >
                  <Text className={`${selected ? 'text-white' : 'text-black'}`}>{tab}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mt-6 px-2">
          <View className="flex-row items-center px-4 py-2">
            <View className="w-8 h-8 bg-gray-200 rounded items-center justify-center mr-3">
              <Text>ⓘ</Text>
            </View>
            <Text className="font-bold text-[16px]">GENEL</Text>
          </View>

          <View className="mt-2 bg-white">
            {questionsByCategory.map(item => (
              <AccordionItem
                key={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Sss;
