import { View, Text, SafeAreaView, Image, TouchableOpacity, Dimensions, ActivityIndicator, ScrollView, ImageBackground } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import { TextInput } from 'react-native-gesture-handler';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Category, fetchCategories } from '../services/categoryService';
import { BestSellerProps, fetchBestSellers } from '../services/bestSeller';
import BestSeller from '../../components/BestSeller';
import CategoryCard from '../../components/CategoryCard';


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
    const allCategories : Category[] = [...data, {  id: 'all-products', 
        name: 'TÜM ÜRÜNLER',
        slug: 'tum-urunler',
        order: data.length + 1 }];
    setCategories(allCategories);
    setLoading(false);
}


 const loadBestSellers = async () => {
    const data = await fetchBestSellers();
    setItems(data);
};

  

  return (

    <SafeAreaView >
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
     
      <CategoryCard categories={categories} images={images} loading={loading} aminoAcidImage={aminoAcidImage} />
      <BestSeller items={items} />

     </ScrollView>
    </SafeAreaView>
  )
}
 export default Home



