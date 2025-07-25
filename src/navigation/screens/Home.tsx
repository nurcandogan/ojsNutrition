import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Category } from '../services/categoryService';



const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / numColumns - 24;

const Home = () => {
   const [searchText, setSearchText] = useState("");  // State to hold the search text
    const [categories, setCategories] = useState<Category[]>([]);    // category servıce'den gelen veri
    const [loading, setLoading] = useState(true);
  return (

    <SafeAreaView className=' '>
    <View className='flex-row justify-between items-center px-6 mt-3 shadow-lg bg-neutral-200 ' >
        <Image source={require('../../assets/ojslogo2.png')} className='w-32 h-16 items-start' resizeMode="contain"  />
       <TouchableOpacity>
         <Feather name="shopping-cart" size={24} color="black" />
       </TouchableOpacity>
    </View>
    
  { /* Search bar */}
    <View className='align-center mt-5  mx-4 flex-row items-center rounded-full bg-inputgray px-4 py-4'>
     <EvilIcons name="search" size={24} color="black" />
     <TextInput
     placeholder="Aradığınız ürünü yazınız..."
       placeholderTextColor="#999"
       className="ml-3 flex-1 text-base p-0"
       value={searchText}
       onChangeText={setSearchText}
       />
    </View>

    <View>
      <Image source={require('../../assets/ojs-slider.png')} className='w-full h-72 mt-4' resizeMode="cover" />
    </View>

    
    </SafeAreaView>
  )
}
 export default Home