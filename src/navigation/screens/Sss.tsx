import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Category } from '../../data/sssData'
import { ScrollView } from 'react-native-gesture-handler'
import BackButtonOverlay from '../../components/BackButtonOverlay'
import { useNavigation } from '@react-navigation/native'
import BackHeader from '../../components/TabsMenu/BackHeader'


const tabs: Category[] = ['Genel', 'Ürünler', 'Kargo']

const Sss = () => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<Category>('Genel') 
  const [openId, setOpenId] = useState<string | null>(null)
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
           className={`px-4 py-3  h-[50px] w-auto justify-center items-center border ${selected ? 'bg-black ' : ' bg-bordergray border-bordergray' }`}>
            <Text className= {`${selected ? 'text-white ' : 'text-black'}`}>
              {tab}
            </Text>
          </TouchableOpacity>

        )
       })}
       </View>
     </View>
     

    </ScrollView>
   </SafeAreaView>
  )
}

export default Sss