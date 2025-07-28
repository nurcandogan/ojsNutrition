import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, ImageBackground } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Category, fetchCategories } from '../services/categoryService';
import { BestSellerProps, fetchBestSellers } from '../services/bestSeller';
import BestSeller from '../../components/BestSeller';


const images = [

  require("../../assets/protein.png"),
  require("../../assets/vitamin.png"),
  require("../../assets/sporgıdaları.png"),
  require("../../assets/gıda.png"),
  require("../../assets/saglık.png"),
  require("../../assets/Katman 1.png"),
 
];
   const aminoAcidImage = require("../../assets/amino-asit-paket.png");


const Home = () => {
    const [searchText, setSearchText] = useState("");                 // State to hold the search text
    const [categories, setCategories] = useState<Category[]>([]);     // category servıce'den gelen veri
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<BestSellerProps[]>([]);        //bestseller servıce'den gelen veri

  useEffect(() => {
    categoriesFetch();
    loadBestSellers();
}, []); 

const categoriesFetch = async () => {
  const data = await fetchCategories();
  // API'den gelen kategorilere "Tüm Ürünler" kategorisini ekle
    const allCategories = [...data, { id: data.length + 1, name: 'TÜM ÜRÜNLER' }];
    setCategories(allCategories);
    setLoading(false);
}


 const loadBestSellers = async () => {
    const data = await fetchBestSellers();
    setItems(data);
};

  

  return (

    <SafeAreaView className=' '>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} >
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

    <View className='mt-3 px-4'>
      <Text className='text-xl font-semibold'>Kategoriler</Text>
    </View>

    { loading ? (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : (
       <View className='flex-row flex-wrap  mt-3'>
        {categories.map((cat, index) => {
          const isAll = cat.name === 'TÜM ÜRÜNLER';
          return (
            <TouchableOpacity 
            key={index}
            activeOpacity={0.8}
            onPress={() => console.log("Kategori seçildi:", cat.name)}
            className='w-1/2 px-2 mb-4'
          >
             <ImageBackground
                  source={images[index] || images[0]}
                  className="w-52 h-32 rounded-xl overflow-hidden items-end  "
                  resizeMode="cover"
                >
                
                {isAll && (
                      <Image
                        source={aminoAcidImage}
                        resizeMode="cover"
                        className="absolute mt-9 left-2 w-20] h-16"
                      />
                    )}

               <View className='flex-1 justify-center items-center p-4 gap-4 mt-5'>
                   <Text className="font-black text-xl text-center leading-tight text-right">{cat.name.replace(' ', '\n')}</Text>

                    <TouchableOpacity className=" bg-black px-4 py-1 rounded-full">
                       <Text className="text-white font-bold text-sm">İNCELE</Text>
                    </TouchableOpacity>
               </View>
             </ImageBackground>
       
          </TouchableOpacity>
          );
        })}
       </View>

    )}
      <BestSeller items={items} />

   
     </ScrollView>
    </SafeAreaView>
  )
}
 export default Home



