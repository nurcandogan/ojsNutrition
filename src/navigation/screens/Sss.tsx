import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Category, sssData } from '../../data/sssData'
import { ScrollView } from 'react-native-gesture-handler'
import BackButtonOverlay from '../../components/BackButtonOverlay'
import { useNavigation } from '@react-navigation/native'
import BackHeader from '../../components/TabsMenu/BackHeader'
import UnderTabs from '../../components/TabsMenu/UnderTabs'
import AccordionItem from '../../components/TabsMenu/AccordionItem'


const tabs: Category[] = ['Genel', 'Ürünler', 'Kargo']


const Sss = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Category>('Genel') 
  const [openId, setOpenId] = useState<string | null>(null)       // hangi  itemin açık olduğunu tutar

const questionsByCategory = useMemo(() => 
  sssData.filter(item => item.category === activeTab),
  [activeTab]);

const toggle = (id: string) => {
  if (openId === id) {
    setOpenId(null);   // aynı item tekrar tıklanırsa kapat
  } else {
    setOpenId(id);      // yeni item açılır
  }
}


  return (
   <SafeAreaView className='bg-white flex-1'>
    <ScrollView>
      <BackHeader onPress={() => navigation.goBack()} title=" S.S.S."/>

     <View className='mx-6 mt-10 mb-4 '>
       <View className='flex-row space-x-2 gap-4 '>
       {tabs.map((tab) => {
        const selected = tab === activeTab;
        return(
          <TouchableOpacity
           key={tab}
           onPress={() => {setActiveTab(tab); setOpenId(null) }} 
           className={`px-4 py-3  h-[50px] w-auto justify-center  items-center border ${selected ? 'bg-black ' : ' bg-bordergray border-bordergray' }` }>
            <Text className= {`${selected ? 'text-white ' : 'text-black'}`} >
              {tab}
            </Text>
          </TouchableOpacity>
        )
       })}
       </View>
     </View>

       <View>
        <UnderTabs title={activeTab}/>

        <View className='mt-5 '>
          {questionsByCategory.map((item) => (
            <AccordionItem key={item.id}
             question={item.question} 
             answer={item.answer} 
             isOpen={openId === item.id}      // açık mı değil mi kontrolü
             onPress={() => toggle(item.id)}
             />
          ))}

        </View>
       </View>



    </ScrollView>
   </SafeAreaView>
  )
}

export default Sss