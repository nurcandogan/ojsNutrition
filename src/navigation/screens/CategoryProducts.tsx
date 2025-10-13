import { View, Text, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { API_BASE_URL, MEDIA_BASE_URL } from '@env';
import AntDesign from '@expo/vector-icons/AntDesign';


interface Product {
  id:string;
  name:string;
  short_explanation:string;
  slug:string;
  comment_count:number;
  average_star:number;
  photo_src:string;
  price_info: {
    total_price:number; 
    discounted_price?:number;
    discount_percentage?:number;
  }
}

type RootStackParamList = {
  ProductDetail: { id: string };
  CategoryProducts: { id: string; name: string; slug: string };
};


const CategoryProducts = () => {
  const route = useRoute();
  const {id, name, slug} = route.params as {id:string, name:string, slug:string};
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  setLoading(false);
    fetchProducts();

 }, [id]);


 const fetchProducts = async() => {
  try {
    const response = await fetch ( `${API_BASE_URL}/products?main_category=${id}`);
    const data = await response.json();
    const productList = data?.data ?? [];
    setProducts(productList);

  } catch (error) {
    console.error('Ürünleri çekerken hata oluştu:', error);
    
  }
 }

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }


  return (
    <SafeAreaView className='flex-1 bg-white '>
      <ScrollView className=' px-[16px] '>
      <Text className='text-center text-[22.5px] font-bold mt-10 mb-4'>{name.toUpperCase()}</Text>
     
     <View className='flex-row flex-wrap justify-between '>
      {products.map((product) => {
        const hasDiscount = product.price_info.discount_percentage !== null; 
        const finalPrice =  product.price_info.discounted_price ?? product.price_info.total_price;
        
        return (    
         <TouchableOpacity
         key={product.id}
         onPress={() => navigation.navigate('ProductDetail', {id: product.id,})}
         className='w-1/2 py-2 h-[344px]  mb-6 '>

          <View className='w-[179px] h-[344px] justify-center mx-auto '>
            <View className='items-center relative  '>
             <Image
              source={{uri: `${MEDIA_BASE_URL}${product.photo_src}`}}
              className='w-[150px] h-[150px] rounded-lg'
              resizeMode='cover'
             />  
              {hasDiscount && (
              <View className='absolute -top-4 -right-2 bg-red-500 px-2 py-1  w-[60px] h-[50px]'>
                <Text className='text-white text-center text-[19.69px] font-bold'> %{product.price_info.discount_percentage} <Text className='text-white text-center text-[11.25px]'> {"\n"}İNDİRİM</Text></Text>
              </View>
              )}
            </View>
          
            <View className='h-[165px]'>
               {/* Product Name */}
             <Text className='text-[18px] text-center font-bold mt-8 leading-tight tracking-tight' numberOfLines={2}>
              {product.name.toUpperCase()}
             </Text>
           
           {/* Short Explanation */}

           {product.short_explanation &&  (
            <Text className="text-gray-500 text-[10.5px] mt-1 text-center mt-2 mx-6 h-8 w-[123.43]"
                  numberOfLines={2}>
            {product.short_explanation.toUpperCase()}

           </Text>
           )}

           {/* Stars */}
           <View className='items-center mt-1'>
            <View className='flex-row '>
              {[...Array(5)].map((_, index) => (
                <AntDesign 
                      key={index}
                      name={index < Math.floor(product.average_star) ? 'star' : 'staro'}
                      size={17}
                      color="#Fdd835"
                />
              ))}
            </View>
             <Text className="text-[12.5px]  mt-1">
                  {product.comment_count} Yorum
             </Text>
           </View>

            {/* Price Info */}
            <View className='flex-row justify-center items-center mt-2 space-x-2'>
              <Text className='text-base text-xl'>{Math.round(finalPrice)} TL </Text>
              {hasDiscount && (
                <Text className='text-[15.75px] text-discountText font-bold  line-through'>
                  {product.price_info.total_price} TL
                </Text>
              )}
            </View>
            </View>

          </View>
         </TouchableOpacity>
        )
      })}
     </View>
      
       {products.length === 0 && (
        <Text className="text-center text-gray-500 mt-10">Bu kategoride ürün bulunamadı.</Text>
      )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default CategoryProducts