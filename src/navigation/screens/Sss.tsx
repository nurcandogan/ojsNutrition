import { View, Text, SafeAreaView } from 'react-native'
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
      <View>
       <BackHeader onPress={() => navigation.goBack()} title=" S.S.S."/>
        
      </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default Sss